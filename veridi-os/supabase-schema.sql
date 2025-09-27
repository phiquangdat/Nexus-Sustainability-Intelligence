-- Veridi OS Supabase Database Schema
-- This file contains the SQL schema for setting up the Supabase database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create power_plants table
CREATE TABLE IF NOT EXISTS power_plants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Natural Gas', 'HFO', 'Coal', 'Renewable')),
    capacity_mw DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create power_plant_data table
CREATE TABLE IF NOT EXISTS power_plant_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plant_id UUID NOT NULL REFERENCES power_plants(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    fuel_consumed_liters DECIMAL(12,2) NOT NULL,
    energy_output_mwh DECIMAL(10,2) NOT NULL,
    co2_emissions_tonnes DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create eu_ets_reports table
CREATE TABLE IF NOT EXISTS eu_ets_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporting_period VARCHAR(50) NOT NULL,
    total_emissions_tonnes DECIMAL(12,3) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Compliant', 'Non-Compliant', 'Pending')),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_power_plant_data_plant_id ON power_plant_data(plant_id);
CREATE INDEX IF NOT EXISTS idx_power_plant_data_timestamp ON power_plant_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_power_plant_data_plant_timestamp ON power_plant_data(plant_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_eu_ets_reports_generated_at ON eu_ets_reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_eu_ets_reports_status ON eu_ets_reports(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_power_plants_updated_at 
    BEFORE UPDATE ON power_plants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample power plants
INSERT INTO power_plants (name, location, fuel_type, capacity_mw) VALUES
('Vaasa Plant A', 'Vaasa, Finland', 'Natural Gas', 150.0),
('Vaasa Plant B', 'Vaasa, Finland', 'HFO', 200.0),
('Helsinki Plant C', 'Helsinki, Finland', 'Natural Gas', 300.0),
('Tampere Plant D', 'Tampere, Finland', 'Renewable', 100.0)
ON CONFLICT DO NOTHING;

-- Insert sample power plant data (last 7 days)
INSERT INTO power_plant_data (plant_id, timestamp, fuel_consumed_liters, energy_output_mwh, co2_emissions_tonnes)
SELECT 
    pp.id,
    generate_series(
        NOW() - INTERVAL '7 days',
        NOW(),
        INTERVAL '1 hour'
    ) as timestamp,
    CASE 
        WHEN pp.fuel_type = 'Natural Gas' THEN (RANDOM() * 5000 + 2000)::DECIMAL(12,2)
        WHEN pp.fuel_type = 'HFO' THEN (RANDOM() * 8000 + 3000)::DECIMAL(12,2)
        WHEN pp.fuel_type = 'Coal' THEN (RANDOM() * 10000 + 5000)::DECIMAL(12,2)
        ELSE (RANDOM() * 2000 + 1000)::DECIMAL(12,2)
    END as fuel_consumed_liters,
    CASE 
        WHEN pp.fuel_type = 'Natural Gas' THEN (RANDOM() * 50 + 25)::DECIMAL(10,2)
        WHEN pp.fuel_type = 'HFO' THEN (RANDOM() * 80 + 40)::DECIMAL(10,2)
        WHEN pp.fuel_type = 'Coal' THEN (RANDOM() * 100 + 50)::DECIMAL(10,2)
        ELSE (RANDOM() * 30 + 15)::DECIMAL(10,2)
    END as energy_output_mwh,
    CASE 
        WHEN pp.fuel_type = 'Natural Gas' THEN (RANDOM() * 25 + 12)::DECIMAL(10,3)
        WHEN pp.fuel_type = 'HFO' THEN (RANDOM() * 40 + 20)::DECIMAL(10,3)
        WHEN pp.fuel_type = 'Coal' THEN (RANDOM() * 50 + 25)::DECIMAL(10,3)
        ELSE (RANDOM() * 5 + 2)::DECIMAL(10,3)
    END as co2_emissions_tonnes
FROM power_plants pp
ON CONFLICT DO NOTHING;

-- Insert sample EU ETS reports
INSERT INTO eu_ets_reports (reporting_period, total_emissions_tonnes, status, generated_at) VALUES
('Q3 2024', 15420.567, 'Compliant', NOW() - INTERVAL '1 day'),
('Q2 2024', 14890.234, 'Compliant', NOW() - INTERVAL '30 days'),
('Q1 2024', 16230.891, 'Non-Compliant', NOW() - INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW power_plant_summary AS
SELECT 
    pp.id,
    pp.name,
    pp.location,
    pp.fuel_type,
    pp.capacity_mw,
    COUNT(ppd.id) as data_points,
    COALESCE(SUM(ppd.energy_output_mwh), 0) as total_energy_output,
    COALESCE(SUM(ppd.co2_emissions_tonnes), 0) as total_co2_emissions,
    COALESCE(AVG(ppd.energy_output_mwh), 0) as avg_energy_output,
    COALESCE(AVG(ppd.co2_emissions_tonnes), 0) as avg_co2_emissions,
    MAX(ppd.timestamp) as last_data_timestamp
FROM power_plants pp
LEFT JOIN power_plant_data ppd ON pp.id = ppd.plant_id
GROUP BY pp.id, pp.name, pp.location, pp.fuel_type, pp.capacity_mw;

-- Create view for recent emissions data
CREATE OR REPLACE VIEW recent_emissions AS
SELECT 
    pp.name as plant_name,
    pp.fuel_type,
    ppd.timestamp,
    ppd.co2_emissions_tonnes,
    ppd.energy_output_mwh,
    ppd.fuel_consumed_liters
FROM power_plant_data ppd
JOIN power_plants pp ON ppd.plant_id = pp.id
WHERE ppd.timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY ppd.timestamp DESC;

-- Enable Row Level Security (RLS)
ALTER TABLE power_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_plant_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_ets_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your security needs)
CREATE POLICY "Allow public read access to power_plants" ON power_plants
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to power_plant_data" ON power_plant_data
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to eu_ets_reports" ON eu_ets_reports
    FOR SELECT USING (true);

-- Create policies for authenticated users (if you implement authentication)
CREATE POLICY "Allow authenticated users to insert power_plant_data" ON power_plant_data
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert eu_ets_reports" ON eu_ets_reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_plant_emissions_summary(plant_uuid UUID, hours_back INTEGER DEFAULT 24)
RETURNS TABLE (
    plant_name VARCHAR(255),
    fuel_type VARCHAR(50),
    total_emissions DECIMAL(10,3),
    total_energy DECIMAL(10,2),
    avg_emissions_per_mwh DECIMAL(10,3),
    data_points BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.name,
        pp.fuel_type,
        SUM(ppd.co2_emissions_tonnes) as total_emissions,
        SUM(ppd.energy_output_mwh) as total_energy,
        CASE 
            WHEN SUM(ppd.energy_output_mwh) > 0 
            THEN SUM(ppd.co2_emissions_tonnes) / SUM(ppd.energy_output_mwh)
            ELSE 0
        END as avg_emissions_per_mwh,
        COUNT(ppd.id) as data_points
    FROM power_plants pp
    LEFT JOIN power_plant_data ppd ON pp.id = ppd.plant_id 
        AND ppd.timestamp >= NOW() - (hours_back || ' hours')::INTERVAL
    WHERE pp.id = plant_uuid
    GROUP BY pp.id, pp.name, pp.fuel_type;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON power_plants TO anon, authenticated;
GRANT SELECT ON power_plant_data TO anon, authenticated;
GRANT SELECT ON eu_ets_reports TO anon, authenticated;
GRANT SELECT ON power_plant_summary TO anon, authenticated;
GRANT SELECT ON recent_emissions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_plant_emissions_summary TO anon, authenticated;
