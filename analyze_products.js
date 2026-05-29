const fs = require('fs');

const content = fs.readFileSync('src/constants/products.ts', 'utf8');
const productsMatch = content.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
if (!productsMatch) {
  console.error('Could not find products array');
  process.exit(1);
}

const products = JSON.parse(productsMatch[1]);

console.log(`Total Products: ${products.length}`);

const categoryStats = {};
const flavorStats = {};
const imageUsage = {};

products.forEach(p => {
  categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
  flavorStats[p.flavor] = (flavorStats[p.flavor] || 0) + 1;
  imageUsage[p.img] = (imageUsage[p.img] || []);
  imageUsage[p.img].push(p.id);
});

console.log('\nCategories:');
Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count}`);
});

console.log('\nImage Usage (Top 15):');
Object.entries(imageUsage).sort((a, b) => b[1].length - a[1].length).slice(0, 15).forEach(([img, ids]) => {
  console.log(`${img}: ${ids.length} products`);
});

// Group by category and show current image sharing
console.log('\nCategory Image Analysis:');
Object.keys(categoryStats).forEach(cat => {
  const catProducts = products.filter(p => p.category === cat);
  const catImages = {};
  catProducts.forEach(p => {
    catImages[p.img] = (catImages[p.img] || 0) + 1;
  });
  console.log(`\nCategory: ${cat} (${catProducts.length} products)`);
  Object.entries(catImages).forEach(([img, count]) => {
     console.log(`  - ${img}: ${count} products`);
  });
});
