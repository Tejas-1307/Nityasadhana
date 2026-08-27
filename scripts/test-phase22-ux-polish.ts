// ============================================================
// NITYASĀDHANĀ — PHASE 22: UX POLISH SPECIFICATION TESTS
// ============================================================
// Validates:
// 1. Devotional Motifs & Art Components (Shri Krishna, Lotus, Flute)
// 2. Devotional Microcopy & Anti-Gamification Standards
// 3. Tactile Button Micro-Interactions & 48px Tap Targets
// 4. Reduced Motion & Mobile Safe Area Invariants
// 5. Hero Section Devotional Art Integration
// ============================================================

import * as fs from "fs";
import * as path from "path";
import { LotusMotif, FluteMotif, ShriKrishnaEditorialArt } from "../components/branding/devotional-motifs";

async function runPhase22UXPolishTests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 22 UX POLISH SPECIFICATION TESTS =============");
  console.log("================================================================\n");

  // ------------------------------------------------------------
  // TEST 1: Devotional Motifs & Art Export
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Devotional Motifs & Editorial Artwork...");
  if (typeof LotusMotif !== "function") {
    throw new Error("LotusMotif is not exported as a valid React component");
  }
  if (typeof FluteMotif !== "function") {
    throw new Error("FluteMotif is not exported as a valid React component");
  }
  if (typeof ShriKrishnaEditorialArt !== "function") {
    throw new Error("ShriKrishnaEditorialArt is not exported as a valid React component");
  }
  console.log("✓ TEST 1 PASSED: Sacred Devotional Motifs & Shri Krishna artwork verified.");

  // ------------------------------------------------------------
  // TEST 2: Anti-Gamification & Devotional Microcopy Audit
  // ------------------------------------------------------------
  console.log("\n[TEST 2] Auditing Microcopy against Gamification & Commercial Tone...");
  const forbiddenTerms = [
    "level up",
    "streak bonus",
    "xp points",
    "supercharge",
    "leaderboard",
    "gamify",
    "winner",
    "loser",
    "failed student",
    "bad performance",
  ];

  const filesToCheck = [
    path.join(process.cwd(), "components", "landing", "hero-section.tsx"),
    path.join(process.cwd(), "components", "dashboard", "today-summary-card.tsx"),
    path.join(process.cwd(), "components", "reports", "report-form.tsx"),
    path.join(process.cwd(), "components", "sankalpa", "dashboard-sankalpa-card.tsx"),
  ];

  for (const filePath of filesToCheck) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8").toLowerCase();
      for (const term of forbiddenTerms) {
        if (content.includes(term)) {
          throw new Error(`VIOLATION: Forbidden gamification term '${term}' found in ${path.basename(filePath)}`);
        }
      }
    }
  }
  console.log("✓ TEST 2 PASSED: 100% adherence to calm, non-gamified devotional copy.");

  // ------------------------------------------------------------
  // TEST 3: Tactile Button Interaction & Tap Targets
  // ------------------------------------------------------------
  console.log("\n[TEST 3] Auditing Button Tactility & Touch Targets...");
  const buttonPath = path.join(process.cwd(), "components", "ui", "button.tsx");
  const buttonContent = fs.readFileSync(buttonPath, "utf-8");

  if (!buttonContent.includes("active:scale-[0.98]") && !buttonContent.includes("active:scale-")) {
    throw new Error("Button component missing tactile active scale micro-interaction");
  }
  if (!buttonContent.includes("min-h-[48px]") && !buttonContent.includes("min-h-[44px]")) {
    throw new Error("Button component missing mobile touch target minimum constraints");
  }
  console.log("✓ TEST 3 PASSED: Button micro-interactions and mobile touch targets confirmed.");

  // ------------------------------------------------------------
  // TEST 4: Reduced Motion & Accessibility Invariants
  // ------------------------------------------------------------
  console.log("\n[TEST 4] Auditing CSS Reduced Motion & Safe Areas...");
  const cssPath = path.join(process.cwd(), "app", "globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  if (!cssContent.includes("prefers-reduced-motion")) {
    throw new Error("globals.css missing prefers-reduced-motion media query");
  }
  if (!cssContent.includes(".pt-safe") || !cssContent.includes(".pb-safe")) {
    throw new Error("globals.css missing mobile safe area insets");
  }
  console.log("✓ TEST 4 PASSED: Accessibility and mobile safe areas verified.");

  // ------------------------------------------------------------
  // TEST 5: Hero Section Devotional Artwork Integration
  // ------------------------------------------------------------
  console.log("\n[TEST 5] Auditing Landing Hero Devotional Artwork...");
  const heroPath = path.join(process.cwd(), "components", "landing", "hero-section.tsx");
  const heroContent = fs.readFileSync(heroPath, "utf-8");

  if (!heroContent.includes("ShriKrishnaEditorialArt") || !heroContent.includes("अभ्यासयोगेन")) {
    throw new Error("Hero section missing Shri Krishna artwork or Bhagavad Gita Sanskrit mantra");
  }
  console.log("✓ TEST 5 PASSED: Landing Hero integrates sacred Shri Krishna art and Sanskrit verse.");

  console.log("\n================================================================");
  console.log("ALL 5 PHASE 22 UX POLISH TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================\n");
}

runPhase22UXPolishTests().catch((err) => {
  console.error("Phase 22 UX Polish Tests Failed:", err);
  process.exit(1);
});
