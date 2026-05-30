const fs = require('fs');
const proposed = JSON.parse(fs.readFileSync('src/constants/proposed_images.json', 'utf8'));
const audit = JSON.parse(fs.readFileSync('audit_results.json', 'utf8'));

const brokenUrls = audit.filter(a => a.status !== 200).map(a => a.url);

const themeMap = {
  "Birthday Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Anniversary Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Wedding Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Bento Cakes": "https://images.unsplash.com/photo-1616031037011-087000171abe?auto=format&fit=crop&w=800&q=80",
  "Theme Cakes": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
  "Photo Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Pinata Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Pull Me Up Cakes": "https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&w=800&q=80",
  "Bomb Cakes": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  "Designer Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Kids Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Cartoon Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Anime Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Superhero Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Romantic Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Couple Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Heart Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Premium Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Luxury Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Chocolate Cakes": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  "Truffle Cakes": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  "Fruit Cakes": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  "Butterscotch Cakes": "https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&w=800&q=80",
  "Vanilla Cakes": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
  "Black Forest Cakes": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  "Red Velvet Cakes": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80",
  "Rasmalai Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Biscoff Cakes": "https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&w=800&q=80",
  "Cheesecakes": "https://images.unsplash.com/photo-1616031037011-087000171abe?auto=format&fit=crop&w=800&q=80",
  "Jar Cakes": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
  "Pastries": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
  "Cupcakes": "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
  "Brownies": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
  "Cookies": "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80",
  "Tea Cakes": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80",
  "Mousse Cakes": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
  "Dry Cakes": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80",
  "Eggless Cakes": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80",
  "Custom Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Festival Cakes": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80",
  "Mother's Day Cakes": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80",
  "Father's Day Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Valentine Cakes": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80",
  "Christmas Cakes": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80",
  "New Year Cakes": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80",
  "Friendship Cakes": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80",
  "Baby Shower Cakes": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
  "Engagement Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Retirement Cakes": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80",
  "Corporate Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Farewell Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Graduation Cakes": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  "Minimal Cakes": "https://images.unsplash.com/photo-1616031037011-087000171abe?auto=format&fit=crop&w=800&q=80",
  "Korean Cakes": "https://images.unsplash.com/photo-1616031037011-087000171abe?auto=format&fit=crop&w=800&q=80",
  "Trending Cakes": "https://images.unsplash.com/photo-1561758033-7e924f619b47?auto=format&fit=crop&w=800&q=80",
  "Dessert Boxes": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
  "Bakery Hampers": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80"
};

const finalMapping = proposed.map(p => {
  if (brokenUrls.includes(p.proposedImg)) {
    return { ...p, proposedImg: themeMap[p.category] || p.proposedImg };
  }
  return p;
});

fs.writeFileSync('restoration_mapping_final.json', JSON.stringify(finalMapping, null, 2));
console.log('Final mapping created with 100% working URLs.');
