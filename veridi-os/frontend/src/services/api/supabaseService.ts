// Supabase Client Service for Frontend
// Integrates Python supabase_client.py functionality

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  key: string;
}

export interface Co2IntensityRecord {
  id?: number;
  timestamp: string;
  co2_intensity_g_per_kwh: number;
}

export interface GenerationMixRecord {
  id?: number;
  timestamp: string;
  hydro_mw: number;
  wind_mw: number;
  solar_mw: number;
  nuclear_mw: number;
  fossil_mw: number;
  total_mw: number;
  renewable_share_pct: number;
}

export interface NetZeroAlignmentRecord {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (url && key) {
      this.config = { url, key };
      this.client = createClient(url, key);
    }
  }

  public isEnabled(): boolean {
    return this.client !== null && this.config !== null;
  }

  public getConfig(): SupabaseConfig | null {
    return this.config;
  }

  // Fetch data from Supabase tables
  public async fetchTable<T = any>(
    table: string,
    limit: number = 1000,
    order: string = "timestamp"
  ): Promise<T[]> {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await this.client
      .from(table)
      .select("*")
      .order(order, { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data || [];
  }

  // Fetch CO2 intensity data
  public async fetchCo2IntensityData(
    limit: number = 1000
  ): Promise<Co2IntensityRecord[]> {
    return this.fetchTable<Co2IntensityRecord>("co2_intensity", limit);
  }

  // Fetch generation mix data
  public async fetchGenerationMixData(
    limit: number = 1000
  ): Promise<GenerationMixRecord[]> {
    return this.fetchTable<GenerationMixRecord>("generation_mix", limit);
  }

  // Fetch net-zero alignment data
  public async fetchNetZeroAlignmentData(
    limit: number = 100
  ): Promise<NetZeroAlignmentRecord[]> {
    return this.fetchTable<NetZeroAlignmentRecord>(
      "netzero_alignment",
      limit,
      "year"
    );
  }

  // Insert data into Supabase tables
  public async insertRows(
    table: string,
    rows: Record<string, any>[],
    onConflict?: string,
    resolution?: string
  ): Promise<void> {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }

    if (!rows || rows.length === 0) {
      return;
    }

    // Prepare payload - serialize datetimes and remove None values
    const payload = rows.map((row) => {
      const obj: Record<string, any> = {};
      for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) {
          continue; // Drop fields with None so DB defaults apply
        }
        if (value instanceof Date) {
          obj[key] = value.toISOString();
        } else {
          obj[key] = value;
        }
      }
      return obj;
    });

    const { error } = await this.client.from(table).upsert(payload, {
      onConflict: onConflict,
      ignoreDuplicates: resolution === "ignore",
    });

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }
  }

  // Insert CO2 intensity data
  public async insertCo2IntensityData(
    data: Omit<Co2IntensityRecord, "id">[]
  ): Promise<void> {
    await this.insertRows("co2_intensity", data);
  }

  // Insert generation mix data
  public async insertGenerationMixData(
    data: Omit<GenerationMixRecord, "id">[]
  ): Promise<void> {
    await this.insertRows("generation_mix", data);
  }

  // Insert net-zero alignment data
  public async insertNetZeroAlignmentData(
    data: NetZeroAlignmentRecord[]
  ): Promise<void> {
    await this.insertRows("netzero_alignment", data, "year", "ignore");
  }

  // Real-time subscriptions
  public subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }

    let query = this.client.channel(`${table}_changes`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
        filter: filter,
      },
      callback
    );

    return query.subscribe();
  }

  // Subscribe to CO2 intensity changes
  public subscribeToCo2Intensity(callback: (payload: any) => void) {
    return this.subscribeToTable("co2_intensity", callback);
  }

  // Subscribe to generation mix changes
  public subscribeToGenerationMix(callback: (payload: any) => void) {
    return this.subscribeToTable("generation_mix", callback);
  }

  // Subscribe to net-zero alignment changes
  public subscribeToNetZeroAlignment(callback: (payload: any) => void) {
    return this.subscribeToTable("netzero_alignment", callback);
  }

  // Test connection
  public async testConnection(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const { error } = await this.client
        .from("co2_intensity")
        .select("count")
        .limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;
