const fs = require('fs');
const audit = JSON.parse(fs.readFileSync('audit_results.json', 'utf8'));
const proposed = JSON.parse(fs.readFileSync('src/constants/proposed_images.json', 'utf8'));

const brokenUrls = audit.filter(a => a.status !== 200).map(a => a.url);
const needsReplacement = proposed.filter(p => brokenUrls.includes(p.proposedImg));

const categories = [...new Set(needsReplacement.map(p => p.category))];
const summary = categories.map(cat => ({
  category: cat,
  count: needsReplacement.filter(p => p.category === cat).length,
  flavors: [...new Set(needsReplacement.filter(p => p.category === cat).map(p => p.flavor))]
}));

console.log(JSON.stringify(summary, null, 2));
