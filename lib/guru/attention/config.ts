// ============================================================
// NITYASĀDHANĀ — ATTENTION ENGINE THRESHOLD CONFIGURATION
// ============================================================
// Central configuration for deterministic pattern detection thresholds.
// Designed for easy tuning based on real ISKCON community feedback.
// ============================================================

export interface AttentionEngineConfig {
  minimumHistoryDays: number;
  missingReports: {
    observeConsecutive: number;
    followUpConsecutive: number;
  };
  japa: {
    observeDeviationPercent: number; // e.g. 20% drop from personal baseline
    followUpDeviationPercent: number; // e.g. 40% drop from personal baseline
    minimumBaseRounds: number; // Minimum baseline rounds to evaluate drop
  };
  wakeUp: {
    observeDeviationMinutes: number; // e.g. 30 mins later than baseline median
    followUpDeviationMinutes: number; // e.g. 75 mins later than baseline median
  };
  sleep: {
    observeDeviationPercent: number; // e.g. 20% variance from baseline
    followUpDeviationPercent: number; // e.g. 35% variance from baseline
  };
  timeWaste: {
    observeIncreaseMinutes: number; // e.g. 30 mins above baseline
    followUpIncreaseMinutes: number; // e.g. 60 mins above baseline
  };
  activityReduction: {
    observeDeviationPercent: number; // e.g. 40% drop in reading/hearing/study
    followUpDeviationPercent: number; // e.g. 60% drop
    minimumBaseMinutes: number; // Only analyze if baseline was at least 20 mins
  };
  routineChange: {
    observeDimensionCount: number; // 2 concurrent dimension shifts -> Observe
    followUpDimensionCount: number; // 3+ concurrent dimension shifts -> Follow-up
  };
}

export const ATTENTION_CONFIG: AttentionEngineConfig = {
  minimumHistoryDays: 5,
  missingReports: {
    observeConsecutive: 1,
    followUpConsecutive: 3,
  },
  japa: {
    observeDeviationPercent: 20,
    followUpDeviationPercent: 40,
    minimumBaseRounds: 4,
  },
  wakeUp: {
    observeDeviationMinutes: 30,
    followUpDeviationMinutes: 75,
  },
  sleep: {
    observeDeviationPercent: 20,
    followUpDeviationPercent: 35,
  },
  timeWaste: {
    observeIncreaseMinutes: 30,
    followUpIncreaseMinutes: 60,
  },
  activityReduction: {
    observeDeviationPercent: 40,
    followUpDeviationPercent: 60,
    minimumBaseMinutes: 20,
  },
  routineChange: {
    observeDimensionCount: 2,
    followUpDimensionCount: 3,
  },
};
