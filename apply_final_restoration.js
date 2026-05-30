const fs = require('fs');

const finalMapping = JSON.parse(fs.readFileSync('restoration_mapping_final.json', 'utf8'));
const productsPath = 'src/constants/products.ts';
let productsContent = fs.readFileSync(productsPath, 'utf8');

let updateCount = 0;
finalMapping.forEach(item => {
  // Regex to find the image URL for a specific product ID
  // Look for id: [ID], then look for the next image: "[URL]"
  const idPattern = new RegExp(`id:\\s*${item.id},[\\s\\S]*?image:\\s*["'][^"']*["']`, 'm');
  const match = productsContent.match(idPattern);

  if (match) {
    const original = match[0];
    const replacement = original.replace(/image:\s*["'][^"']*["']/, `image: "${item.proposedImg}"`);
    if (original !== replacement) {
      productsContent = productsContent.replace(original, replacement);
      updateCount++;
    }
  }
});

fs.writeFileSync(productsPath, productsContent);
console.log(`Successfully updated ${updateCount} product images in ${productsPath}`);
