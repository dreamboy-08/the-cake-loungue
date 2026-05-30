const https = require('https');
const fs = require('fs');

const proposedImages = JSON.parse(fs.readFileSync('src/constants/proposed_images.json', 'utf8'));
const uniqueUrls = [...new Set(proposedImages.map(item => item.proposedImg))];

console.log(`Checking ${uniqueUrls.length} unique URLs...`);

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: 'ERROR', error: e.message });
    });
  });
}

async function runAudit() {
  const results = [];
  for (const url of uniqueUrls) {
    const result = await checkUrl(url);
    results.push(result);
    console.log(`${result.status === 200 ? 'PASS' : 'FAIL'} [${result.status}] ${url}`);
  }
  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
  console.log('Audit complete. Results saved to audit_results.json');
}

runAudit();
