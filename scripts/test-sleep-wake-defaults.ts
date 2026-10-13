import {
  calculateSleepDuration,
  formatDuration,
  formatTime12Hour,
  timeToMinutes,
} from "../lib/reports/calculations";
import { validateReportInput } from "../lib/reports/validation";

function formatTime12HourPadded(timeStr: string): string {
  if (!timeStr) return "--:--";
  const totalMinutes = timeToMinutes(timeStr);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function parse12To24(hour12: number, minute: number, period: "AM" | "PM"): string {
  let h24 = hour12 % 12;
  if (period === "PM") h24 += 12;
  return `${h24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

async function runTests() {
  console.log("=== RUNNING SLEEP & WAKE DEFAULTS VERIFICATION ===");

  // 1. Defaults verification
  const defaultSleep = "21:00";
  const defaultWake = "03:30";

  console.log("[Test 1] Verifying 12-hour display format for defaults...");
  const sleep12 = formatTime12HourPadded(defaultSleep);
  const wake12 = formatTime12HourPadded(defaultWake);

  console.log(`- Sleep: ${defaultSleep} -> ${sleep12}`);
  console.log(`- Wake:  ${defaultWake} -> ${wake12}`);

  if (sleep12 !== "09:00 PM") {
    throw new Error(`Expected '09:00 PM', got '${sleep12}'`);
  }
  if (wake12 !== "03:30 AM") {
    throw new Error(`Expected '03:30 AM', got '${wake12}'`);
  }
  console.log("✓ Test 1 Passed: Defaults display strictly in 12-hour AM/PM format.\n");

  // 2. Sleep duration calculation
  console.log("[Test 2] Verifying sleep duration calculation for defaults...");
  const durationMinutes = calculateSleepDuration(defaultSleep, defaultWake);
  const formattedDuration = formatDuration(durationMinutes);

  console.log(`- Calculated duration: ${durationMinutes} minutes`);
  console.log(`- Formatted duration:  ${formattedDuration}`);

  if (durationMinutes !== 390) {
    throw new Error(`Expected 390 minutes (6h 30m), got ${durationMinutes}`);
  }
  if (formattedDuration !== "6h 30m") {
    throw new Error(`Expected '6h 30m', got '${formattedDuration}'`);
  }
  console.log("✓ Test 2 Passed: Sleep duration accurately calculates to 6h 30m across midnight.\n");

  // 3. Bidirectional conversion
  console.log("[Test 3] Verifying bidirectional 12h <-> 24h conversions...");
  const testCases = [
    { h12: 9, m: 0, period: "PM" as const, expected24: "21:00" },
    { h12: 3, m: 30, period: "AM" as const, expected24: "03:30" },
    { h12: 12, m: 0, period: "AM" as const, expected24: "00:00" },
    { h12: 12, m: 0, period: "PM" as const, expected24: "12:00" },
    { h12: 8, m: 45, period: "PM" as const, expected24: "20:45" },
    { h12: 3, m: 20, period: "AM" as const, expected24: "03:20" },
    { h12: 10, m: 15, period: "PM" as const, expected24: "22:15" },
  ];

  for (const tc of testCases) {
    const res24 = parse12To24(tc.h12, tc.m, tc.period);
    const res12 = formatTime12HourPadded(res24);
    const expected12 = `${tc.h12.toString().padStart(2, "0")}:${tc.m.toString().padStart(2, "0")} ${tc.period}`;
    if (res24 !== tc.expected24) {
      throw new Error(`Expected 24h '${tc.expected24}', got '${res24}'`);
    }
    if (res12 !== expected12) {
      throw new Error(`Expected 12h '${expected12}', got '${res12}'`);
    }
  }
  console.log("✓ Test 3 Passed: Bidirectional conversions are lossless.\n");

  // 4. Validation with defaults
  console.log("[Test 4] Verifying report submission validation accepts defaults...");
  const validReport = validateReportInput({
    practiceDate: new Date().toISOString().split("T")[0],
    sleepTime: defaultSleep,
    wakeUpTime: defaultWake,
    japaRounds: 16,
  });

  if (!validReport.success) {
    throw new Error(`Validation failed for default report: ${validReport.error}`);
  }
  console.log("✓ Test 4 Passed: Defaults pass strict schema validation.\n");

  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
