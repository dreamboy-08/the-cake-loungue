/* ---- Product and Gallery Data ---- */
const products = window.bakeryMenu || [];
const galleryImgs = [
  { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', label: 'Chocolate Truffle' },
  { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', label: 'Strawberry Dream' },
  { src: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&q=80', label: 'Birthday Special' },
  { src: 'https://images.unsplash.com/photo-1618426703623-c1b334571d97?w=400&q=80', label: 'Wedding Cake' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', label: 'Vanilla Delight' },
  { src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80', label: 'Red Velvet' },
  { src: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&q=80', label: 'Custom Creation' },
  { src: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&q=80', label: 'Lemon Bliss' },
];

/* ===== Reusable Product Card Component ===== */
function createProductCard(p) {
  const imageUrl = p.img || p.image || 'https://images.unsplash.com/photo-1505253216373-cc6e4fa75551?auto=format&fit=crop&w=1000&q=80';
  const ribbon = p.tag ? `<div class="product-tag-ribbon">${p.tag}</div>` : '';
  const oldPriceHTML = p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice}</span>` : '';

  return `
    <div class="product-card">
      <div class="product-img">
        <img src="${imageUrl}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505253216373-cc6e4fa75551?auto=format&fit=crop&w=1000&q=80'" />
        ${ribbon}
        <button class="product-wish" onclick="toggleWish(this)" aria-label="Wishlist">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-flavor">${p.flavor}</div>
        <div class="product-stars">
          ${[1, 2, 3, 4, 5].map(s =>
            `<i class="fa${s <= p.rating ? 's' : 'r'} fa-star"></i>`
          ).join('')}
          <span>(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div>
            <span class="product-price">₹${p.price}</span>
            ${oldPriceHTML}
          </div>
          <button class="add-to-cart" onclick='addToCart(this, ${JSON.stringify(p.name)}, ${p.price}, ${JSON.stringify(p.img)})'>
            <i class="fas fa-plus"></i> Add
          </button>
        </div>
      </div>
    </div>`;
}

/* ===== Build Featured Products (Home Page) ===== */
function buildFeaturedProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const featuredProducts = products.slice(0, 8);
  grid.innerHTML = featuredProducts.map(p => createProductCard(p)).join('');
}

/* ===== Build Menu Page Logic ===== */
function buildMenu() {
  const menuContent = document.getElementById('menuContent');
  const categoryTabs = document.getElementById('categoryTabs');
  if (!menuContent || !products.length) return;

  const categoryMap = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const categoryNames = Object.keys(categoryMap);

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Render Tabs
  if (categoryTabs) {
    categoryTabs.innerHTML = categoryNames.map(name =>
      `<a href="#${slugify(name)}" class="category-pill">${name} (${categoryMap[name].length})</a>`
    ).join('');
  }

  // Render Sections
  function renderSections(filteredMap) {
    const names = Object.keys(filteredMap);
    if (names.length === 0) {
      menuContent.innerHTML = '<div style="text-align:center; padding:40px 0; color: var(--text-soft);">No matching cakes found.</div>';
      return;
    }
    menuContent.innerHTML = names.map(category => {
      const items = filteredMap[category];
      const heading = `<div class="category-section" id="${slugify(category)}">
        <div class="category-header">
          <div>
            <h2>${category}</h2>
            <div class="category-count">${items.length} items</div>
          </div>
        </div>`;
      const cards = items.map(p => createProductCard(p)).join('');
      return `${heading}<div class="products-grid">${cards}</div></div>`;
    }).join('');
  }

  renderSections(categoryMap);

  // Search Logic
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filteredMap = {};

      categoryNames.forEach(cat => {
        const matching = categoryMap[cat].filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.flavor.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
        if (matching.length > 0) filteredMap[cat] = matching;
      });

      renderSections(filteredMap);
    });
  }
}

/* ===== Build Gallery Slider (Home Page) ===== */
function buildSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  const all = [...galleryImgs, ...galleryImgs];
  track.innerHTML = all.map(g => `
    <div class="slide-item">
      <img src="${g.src}" alt="${g.label}" loading="lazy" />
      <div class="slide-item-overlay"></div>
      <div class="slide-item-label">${g.label}</div>
    </div>
  `).join('');
}

/* ===== Build Marquee (Home Page) ===== */
function buildMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const offers = [
    '🎂 Use code <strong>SWEET20</strong> for 20% off your first order!',
    '🚚 <strong>Free delivery</strong> on orders above ₹999',
    '🎁 Custom cakes available — <strong>Order 2 days in advance</strong>',
    '⭐ Rated <strong>#1 Bakery</strong> in Delhi NCR 2024',
    '🍓 New Summer Flavours now available — <strong>Mango Sorbet & Lychee Rose</strong>',
    '🎉 <strong>Same-day delivery</strong> in select areas — Order before 2 PM',
  ];
  const all = [...offers, ...offers];
  track.innerHTML = all.map(o =>
    `<span class="marquee-item"><i class="fas fa-circle-dot"></i> <span>${o}</span></span>`
  ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  buildFeaturedProducts();
  buildMenu();
  buildSlider();
  buildMarquee();
});
