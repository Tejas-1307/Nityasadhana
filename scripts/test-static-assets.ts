async function testStaticAssets() {
  const res = await fetch("http://localhost:3000/");
  const html = await res.text();
  console.log("Home status:", res.status);

  // Extract all script tags and css links
  const scriptMatches = html.match(/src="(\/_next\/static\/[^"]+)"/g) || [];
  const cssMatches = html.match(/href="(\/_next\/static\/[^"]+)"/g) || [];

  console.log(`Found ${scriptMatches.length} scripts and ${cssMatches.length} css files in HTML`);

  for (const s of scriptMatches) {
    const url = s.replace('src="', '').replace('"', '');
    const assetRes = await fetch(`http://localhost:3000${url}`);
    console.log(`Asset: ${url} -> Status: ${assetRes.status}`);
    if (assetRes.status !== 200) {
      const errText = await assetRes.text();
      console.log(`Error body:`, errText);
    }
  }

  for (const c of cssMatches) {
    const url = c.replace('href="', '').replace('"', '');
    const assetRes = await fetch(`http://localhost:3000${url}`);
    console.log(`CSS: ${url} -> Status: ${assetRes.status}`);
    if (assetRes.status !== 200) {
      const errText = await assetRes.text();
      console.log(`Error body:`, errText);
    }
  }
}

testStaticAssets().catch(console.error);
