const fs = require('fs');

const content = fs.readFileSync('src/constants/products.ts', 'utf8');
const productsMatch = content.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
const products = JSON.parse(productsMatch[1]);

const report = [];

const categories = [...new Set(products.map(p => p.category))];

categories.forEach(cat => {
  const catProducts = products.filter(p => p.category === cat);
  const flavors = [...new Set(catProducts.map(p => p.flavor))];
  const images = [...new Set(catProducts.map(p => p.img))];

  // Identify common themes based on category and flavors
  let recommendedTheme = '';
  if (cat.includes('Chocolate') || flavors.some(f => f.includes('Chocolate'))) recommendedTheme = 'Rich Chocolate / Truffle';
  else if (cat.includes('Fruit') || flavors.some(f => f.includes('Fruit') || f.includes('Berry') || f.includes('Mango'))) recommendedTheme = 'Fresh Fruit / Vibrant Berries';
  else if (cat.includes('Birthday') || cat.includes('Kids') || cat.includes('Cartoon')) recommendedTheme = 'Colorful / Celebration / Festive';
  else if (cat.includes('Wedding') || cat.includes('Anniversary') || cat.includes('Romantic')) recommendedTheme = 'Elegant / Floral / White & Pastel';
  else recommendedTheme = 'Artisanal / Flavor-specific';

  report.push({
    category: cat,
    count: catProducts.length,
    currentImages: images.length,
    flavors: flavors,
    recommendedTheme: recommendedTheme
  });
});

console.log(JSON.stringify(report, null, 2));
