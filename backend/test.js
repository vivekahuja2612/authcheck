const fs = require('fs');
const path = require('path');

const PHOTO_DIR = path.join(process.env.HOME, 'Downloads/test-photos');
const PRODUCT_NAME = process.argv[2] || 'Nike Air Jordan 1 Retro High OG Chicago';
const BACKEND = 'http://localhost:3000';

const imageFiles = fs.readdirSync(PHOTO_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
console.log(`Sending ${imageFiles.length} photo(s) for: "${PRODUCT_NAME}"\n`);

const images = imageFiles.map(f => fs.readFileSync(path.join(PHOTO_DIR, f)).toString('base64'));

const start = Date.now();

fetch(`${BACKEND}/authenticate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productName: PRODUCT_NAME, images }),
})
  .then(r => r.json())
  .then(result => {
    const latency = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`Latency: ${latency}s\n`);
    console.log(JSON.stringify(result, null, 2));

    // Quick pass/fail check
    if (result.error) {
      console.log('\n✗ ERROR:', result.error);
    } else {
      const checks = result.checks?.length ?? 0;
      console.log(`\nVerdict: ${result.verdict}`);
      console.log(`Confidence: ${result.confidence}% (max allowed: 95)`);
      console.log(`Checks: ${checks} (min required: 5)`);
      console.log(`Confidence ≤ 95: ${result.confidence <= 95 ? '✓' : '✗'}`);
      console.log(`Checks ≥ 5: ${checks >= 5 ? '✓' : '✗'}`);
      console.log(`Latency < 30s: ${parseFloat(latency) < 30 ? '✓' : '✗'}`);
    }
  })
  .catch(err => console.error('Request failed:', err.message));
