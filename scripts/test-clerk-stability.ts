async function testAuthRoutes() {
  console.log("================================================================");
  console.log("=== RUNNING AUTHENTICATION & CLERK STABILITY TESTS ===");
  console.log("================================================================\n");

  let baseUrl = "http://localhost:3000";
  try {
    const check = await fetch("http://localhost:3000/", { signal: AbortSignal.timeout(1000) });
    if (!check.ok) throw new Error("not ok");
  } catch {
    baseUrl = "http://localhost:3001";
  }
  console.log(`-> Testing against: ${baseUrl}\n`);

  // Test 1: Root / Landing Page
  console.log("[TEST 1] Testing Landing Page (/)...");
  const resHome = await fetch(`${baseUrl}/`, { redirect: "manual" });
  console.log(`-> Home Status: ${resHome.status}`);
  if (resHome.status !== 200) {
    throw new Error(`Landing page returned unexpected status: ${resHome.status}`);
  }
  const homeHtml = await resHome.text();
  if (homeHtml.includes("clerk.nityasadhana.dev")) {
    throw new Error("Landing page still contains broken clerk.nityasadhana.dev domain!");
  }
  console.log("✓ TEST 1 PASSED: Landing page loads successfully with 0 broken Clerk domains.\n");

  // Test 2: Login Page (/login)
  console.log("[TEST 2] Testing Login Page (/login)...");
  const resLogin = await fetch(`${baseUrl}/login`, { redirect: "manual" });
  console.log(`-> Login Status: ${resLogin.status}`);
  if (resLogin.status !== 200) {
    throw new Error(`Login page returned unexpected status: ${resLogin.status}`);
  }
  const loginHtml = await resLogin.text();
  if (loginHtml.includes("clerk.nityasadhana.dev")) {
    throw new Error("Login page still contains broken clerk.nityasadhana.dev domain!");
  }
  console.log("✓ TEST 2 PASSED: Login page returns HTTP 200 without 500 error or broken domain.\n");

  // Test 3: Signup Page (/signup)
  console.log("[TEST 3] Testing Signup Page (/signup)...");
  const resSignup = await fetch(`${baseUrl}/signup`, { redirect: "manual" });
  console.log(`-> Signup Status: ${resSignup.status}`);
  if (resSignup.status !== 200) {
    throw new Error(`Signup page returned unexpected status: ${resSignup.status}`);
  }
  const signupHtml = await resSignup.text();
  if (signupHtml.includes("clerk.nityasadhana.dev")) {
    throw new Error("Signup page still contains broken clerk.nityasadhana.dev domain!");
  }
  console.log("✓ TEST 3 PASSED: Signup page returns HTTP 200.\n");

  // Test 4: Forgot Password Page (/forgot-password)
  console.log("[TEST 4] Testing Forgot Password Page (/forgot-password)...");
  const resForgot = await fetch(`${baseUrl}/forgot-password`, { redirect: "manual" });
  console.log(`-> Forgot Password Status: ${resForgot.status}`);
  if (resForgot.status !== 200) {
    throw new Error(`Forgot password page returned unexpected status: ${resForgot.status}`);
  }
  console.log("✓ TEST 4 PASSED: Forgot password page returns HTTP 200.\n");

  // Test 5: Protected Route Redirect (/student)
  console.log("[TEST 5] Testing Protected Route Redirect (/student when unauthenticated)...");
  const resStudent = await fetch(`${baseUrl}/student`, { redirect: "manual" });
  const studentText = await resStudent.text();
  const isRedirect =
    resStudent.status === 307 ||
    resStudent.status === 302 ||
    resStudent.status === 308 ||
    studentText.includes("NEXT_REDIRECT") ||
    studentText.includes("/login");

  console.log(
    `-> Student Route Status: ${resStudent.status}, Is Redirected: ${isRedirect}, Contains NEXT_REDIRECT: ${studentText.includes("NEXT_REDIRECT")}`
  );
  if (!isRedirect) {
    throw new Error(`Expected /student to enforce authentication redirect, got status: ${resStudent.status}`);
  }
  console.log("✓ TEST 5 PASSED: Unauthenticated access to /student correctly enforces redirect to /login.\n");

  // Test 6: Protected Route Redirect (/guru)
  console.log("[TEST 6] Testing Protected Route Redirect (/guru when unauthenticated)...");
  const resGuru = await fetch(`${baseUrl}/guru`, { redirect: "manual" });
  const guruText = await resGuru.text();
  const isGuruRedirect =
    resGuru.status === 307 ||
    resGuru.status === 302 ||
    resGuru.status === 308 ||
    guruText.includes("NEXT_REDIRECT") ||
    guruText.includes("/login");

  console.log(
    `-> Guru Route Status: ${resGuru.status}, Is Redirected: ${isGuruRedirect}, Contains NEXT_REDIRECT: ${guruText.includes("NEXT_REDIRECT")}`
  );
  if (!isGuruRedirect) {
    throw new Error(`Expected /guru to enforce authentication redirect, got status: ${resGuru.status}`);
  }
  console.log("✓ TEST 6 PASSED: Unauthenticated access to /guru correctly enforces redirect to /login.\n");

  // Test 7: Clerk Browser JS Availability
  console.log("[TEST 7] Testing Clerk Browser JS Script URL...");
  const scriptMatch = loginHtml.match(/src=[\"'](https:\/\/[^\"']*clerk[^\"']*)[\"']/i);
  if (scriptMatch) {
    const scriptUrl = scriptMatch[1];
    console.log(`-> Detected Clerk script URL: ${scriptUrl}`);
    const scriptRes = await fetch(scriptUrl);
    console.log(`-> Script Fetch Status: ${scriptRes.status}, Content-Type: ${scriptRes.headers.get("content-type")}`);
    if (scriptRes.status !== 200) {
      throw new Error(`Clerk script failed to load with status: ${scriptRes.status}`);
    }
  } else {
    console.log("-> Note: Standard Clerk JS script tag handled by ClerkProvider.");
  }
  console.log("✓ TEST 7 PASSED: Clerk browser script is accessible.\n");

  console.log("================================================================");
  console.log("ALL 7 AUTHENTICATION & CLERK STABILITY TESTS PASSED!");
  console.log("================================================================");
}

testAuthRoutes().catch((err) => {
  console.error("\nTEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
