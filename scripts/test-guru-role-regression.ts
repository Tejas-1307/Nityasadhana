import { normalizeRoleValue } from "../lib/auth/auth";

const cases: Array<[unknown, string | null]> = [
  ["guru", "guru"],
  ["shishya", "shishya"],
  ["student", "shishya"],
  ["Guru", "guru"],
  ["  shishya  ", "shishya"],
  ["admin", null],
  [null, null],
  [undefined, null],
];

for (const [input, expected] of cases) {
  const actual = normalizeRoleValue(input);
  if (actual !== expected) {
    throw new Error(`normalizeRoleValue(${String(input)}) expected ${String(expected)} but got ${String(actual)}`);
  }
}

console.log("Guru role normalization regression tests passed.");
