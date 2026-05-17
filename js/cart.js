let cart = JSON.parse(localStorage.getItem('cakeLounge_cart')) || [];
let cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

function addToCart(btn, name, price, img = '') {
  animateToCart(btn, name);

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }

  saveCart();
  updateCartDisplay();

  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fas fa-plus"></i> Add';
    }, 1800);
  }
  showToast(`🎂 ${name} added!`);
}

function updateQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartDisplay();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartDisplay();
  showToast('Item removed from cart');
}

function saveCart() {
  localStorage.setItem('cakeLounge_cart', JSON.stringify(cart));
  cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartBadge = document.getElementById('cartBadge');

  if (cartItems) {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.img || 'https://via.placeholder.com/70?text=Cake'}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="qty-val">${item.quantity || 1}</span>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-price">₹${item.price * (item.quantity || 1)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  if (cartTotal) cartTotal.textContent = total;
  if (cartBadge) cartBadge.textContent = cartCount;

  updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
  const checkoutCart = document.getElementById('checkoutCart');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const razorpayButton = document.getElementById('razorpayButton');
  const emptyMsg = document.getElementById('emptyCartMsg');
  const checkoutDetails = document.getElementById('checkoutDetails');

  if (!checkoutCart || !checkoutTotal) return;

  if (cart.length === 0) {
    checkoutCart.innerHTML = '';
    checkoutTotal.textContent = '0';
    if (razorpayButton) razorpayButton.style.display = 'none';
    if (checkoutDetails) checkoutDetails.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
  } else {
    checkoutCart.innerHTML = cart.map((item, index) => `
      <div class="checkout-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid var(--cream-dark);">
        <div class="checkout-item-info">
          <h4 style="margin:0; font-size: 1rem;">${item.name}</h4>
          <div class="cart-item-controls" style="margin-top: 5px;">
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="qty-val">${item.quantity || 1}</span>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <div class="checkout-item-price" style="font-weight: 700; color: var(--rose-deep);">₹${item.price * (item.quantity || 1)}</div>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    checkoutTotal.textContent = total;
    if (razorpayButton) razorpayButton.style.display = 'inline-block';
    if (checkoutDetails) checkoutDetails.style.display = 'block';
    if (emptyMsg) emptyMsg.style.display = 'none';
  }
}

/* Animation, Toast, and Modal helpers kept for compatibility */
function animateToCart(source, name) {
  const cartBubble = document.getElementById('cart-bubble');
  if (!source || !cartBubble || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const productCard = source.closest ? source.closest('.product-card') : null;
  const productImg = productCard ? productCard.querySelector('.product-img img') : null;
  const sourceRect = (productImg || source).getBoundingClientRect();
  const cartRect = cartBubble.getBoundingClientRect();
  const flyer = document.createElement('div');
  const hasImage = Boolean(productImg && productImg.currentSrc);
  const size = hasImage ? Math.min(118, Math.max(74, sourceRect.width * .42)) : 92;
  const height = hasImage ? size : 42;
  flyer.className = 'cart-flyer';
  flyer.style.width = `${size}px`; flyer.style.height = `${height}px`;
  flyer.style.left = `${sourceRect.left + (sourceRect.width - size) / 2}px`;
  flyer.style.top = `${sourceRect.top + (sourceRect.height - height) / 2}px`;
  flyer.style.setProperty('--fly-x', `${cartRect.left + cartRect.width / 2 - sourceRect.left - sourceRect.width / 2}px`);
  flyer.style.setProperty('--fly-y', `${cartRect.top + cartRect.height / 2 - sourceRect.top - sourceRect.height / 2}px`);
  if (hasImage) {
    const img = document.createElement('img');
    img.src = productImg.currentSrc; img.alt = name; flyer.appendChild(img);
  } else {
    flyer.innerHTML = `<span class="cart-flyer-text"><i class="fas fa-cake-candles"></i> ${name}</span>`;
  }
  document.body.appendChild(flyer);
  requestAnimationFrame(() => flyer.classList.add('fly'));
  setTimeout(() => {
    flyer.remove();
    cartBubble.classList.remove('cart-hit');
    void cartBubble.offsetWidth;
    cartBubble.classList.add('cart-hit');
  }, 820);
}

function showToast(msg) {
  const t = document.getElementById('cart-toast');
  if (t) {
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }
}

function openCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.add('show');
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('show');
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast('Cart is empty!'); return;
  }
  closeCartModal(); window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});

window.addEventListener('storage', (e) => {
  if (e.key === 'cakeLounge_cart') {
    try {
      cart = JSON.parse(e.newValue) || [];
      cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      updateCartDisplay();
      console.log('Cart synchronized across tabs.');
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  }
});
