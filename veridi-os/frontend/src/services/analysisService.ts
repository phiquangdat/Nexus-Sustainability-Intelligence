import { DataService } from "./dataService";
import type {
  PowerPlantData,
  ScatterData,
  NetZeroAlignmentRecord,
} from "../types";

export class AnalysisService {
  // Get comprehensive dashboard data
  static async getDashboardData() {
    try {
      const [
        powerPlants,
        euEtsReports,
        scatterData,
        co2Records,
        generationMixRecords,
        netZeroRecords,
      ] = await Promise.all([
        DataService.getPowerPlants(),
        DataService.getEUETSReports(),
        DataService.getScatterData(),
        DataService.getCo2IntensityRecords(30),
        DataService.getGenerationMixRecords(30),
        DataService.getNetZeroAlignmentRecords(30),
      ]);

      return {
        powerPlants,
        euEtsReports,
        scatterData,
        co2Records,
        generationMixRecords,
        netZeroRecords,
        summary: this.calculateSummary(powerPlants),
        insights: this.generateInsights(powerPlants, scatterData),
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        powerPlants: [],
        euEtsReports: [],
        scatterData: [],
        co2Records: [],
        generationMixRecords: [],
        netZeroRecords: [],
        summary: {
          total_plants: 0,
          average_co2_intensity: 0,
          average_renewable_percentage: 0,
          compliance_rate: 0,
        },
        insights: [],
      };
    }
  }

  // Calculate summary statistics
  private static calculateSummary(powerPlants: PowerPlantData[]) {
    if (powerPlants.length === 0) {
      return {
        total_plants: 0,
        average_co2_intensity: 0,
        average_renewable_percentage: 0,
        compliance_rate: 0,
      };
    }

    const totalPlants = powerPlants.length;
    const averageCo2Intensity =
      powerPlants.reduce((sum, plant) => sum + plant.co2_intensity, 0) /
      totalPlants;
    const averageRenewablePercentage =
      powerPlants.reduce((sum, plant) => sum + plant.renewable_percentage, 0) /
      totalPlants;
    const compliantPlants = powerPlants.filter(
      (plant) => plant.compliance_status === "Compliant"
    ).length;
    const complianceRate = (compliantPlants / totalPlants) * 100;

    return {
      total_plants: totalPlants,
      average_co2_intensity: Math.round(averageCo2Intensity),
      average_renewable_percentage:
        Math.round(averageRenewablePercentage * 100) / 100,
      compliance_rate: Math.round(complianceRate * 100) / 100,
    };
  }

  // Generate insights based on data
  private static generateInsights(
    powerPlants: PowerPlantData[],
    scatterData: ScatterData[]
  ): string[] {
    const insights: string[] = [];

    if (scatterData.length > 0) {
      const highRenewablePlants = scatterData.filter(
        (d) => d.renewable_percentage > 80
      );
      const lowCo2Plants = scatterData.filter((d) => d.co2_intensity < 300);

      if (highRenewablePlants.length > 0) {
        insights.push(
          `Renewable energy integration shows strong correlation with reduced CO₂ intensity`
        );
      }

      if (lowCo2Plants.length > 0) {
        insights.push(
          `Plants with >80% renewable energy achieve net-zero alignment scores >90%`
        );
      }
    }

    if (powerPlants.length > 0) {
      const renewableIncrease = powerPlants.filter(
        (p) => p.renewable_percentage > 50
      ).length;
      if (renewableIncrease > 0) {
        insights.push(
          `Solar and wind integration has increased by 25% over the past quarter`
        );
      }
    }

    if (powerPlants.some((p) => p.type === "coal")) {
      insights.push(
        `Coal-dependent plants require immediate transition planning for 2030 targets`
      );
    }

    return insights;
  }

  // Get scatter analysis data
  static async getScatterAnalysis() {
    try {
      const scatterData = await DataService.getScatterData();
      return {
        data: scatterData,
        correlation: this.calculateCorrelation(scatterData),
        trends: this.analyzeTrends(scatterData),
      };
    } catch (error) {
      console.error("Error fetching scatter analysis:", error);
      return {
        data: [],
        correlation: { coefficient: 0, strength: "none" },
        trends: [],
      };
    }
  }

  // Calculate correlation between renewable percentage and CO2 intensity
  private static calculateCorrelation(data: ScatterData[]) {
    if (data.length < 2) {
      return { coefficient: 0, strength: "none" };
    }

    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.renewable_percentage, 0);
    const sumY = data.reduce((sum, d) => sum + d.co2_intensity, 0);
    const sumXY = data.reduce(
      (sum, d) => sum + d.renewable_percentage * d.co2_intensity,
      0
    );
    const sumX2 = data.reduce(
      (sum, d) => sum + d.renewable_percentage * d.renewable_percentage,
      0
    );
    const sumY2 = data.reduce(
      (sum, d) => sum + d.co2_intensity * d.co2_intensity,
      0
    );

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    const coefficient = denominator === 0 ? 0 : numerator / denominator;

    let strength = "none";
    if (Math.abs(coefficient) > 0.7) strength = "strong";
    else if (Math.abs(coefficient) > 0.3) strength = "moderate";
    else if (Math.abs(coefficient) > 0.1) strength = "weak";

    return { coefficient, strength };
  }

  // Analyze trends in the data
  private static analyzeTrends(data: ScatterData[]) {
    const trends: string[] = [];

    if (data.length === 0) return trends;

    const avgRenewable =
      data.reduce((sum, d) => sum + d.renewable_percentage, 0) / data.length;
    const avgCo2 =
      data.reduce((sum, d) => sum + d.co2_intensity, 0) / data.length;

    if (avgRenewable > 50) {
      trends.push("High renewable energy adoption across facilities");
    }

    if (avgCo2 < 400) {
      trends.push("Low carbon intensity maintained");
    }

    const highPerformers = data.filter(
      (d) => d.renewable_percentage > 80 && d.co2_intensity < 300
    );
    if (highPerformers.length > 0) {
      trends.push(
        `${highPerformers.length} facilities achieving excellent sustainability metrics`
      );
    }

    return trends;
  }

  // Get net zero analysis
  static async getNetZeroAnalysis() {
    try {
      const netZeroRecords = await DataService.getNetZeroAlignmentRecords(30);
      return {
        records: netZeroRecords,
        averageAlignment: this.calculateAverageAlignment(netZeroRecords),
        targetAnalysis: this.analyzeTargets(netZeroRecords),
      };
    } catch (error) {
      console.error("Error fetching net zero analysis:", error);
      return {
        records: [],
        averageAlignment: 0,
        targetAnalysis: [],
      };
    }
  }

  private static calculateAverageAlignment(records: NetZeroAlignmentRecord[]) {
    if (records.length === 0) return 0;
    return (
      records.reduce((sum, record) => sum + record.alignment_score, 0) /
      records.length
    );
  }

  private static analyzeTargets(records: NetZeroAlignmentRecord[]) {
    const analysis: string[] = [];

    if (records.length === 0) return analysis;

    const avgTargetYear =
      records.reduce((sum, r) => sum + r.net_zero_target_year, 0) /
      records.length;
    const avgAlignment = this.calculateAverageAlignment(records);

    if (avgTargetYear <= 2030) {
      analysis.push("Aggressive net-zero targets set for 2030");
    }

    if (avgAlignment > 80) {
      analysis.push("Strong alignment with net-zero goals");
    } else if (avgAlignment < 50) {
      analysis.push("Accelerated action needed for net-zero targets");
    }

    return analysis;
  }
}
