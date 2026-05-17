/* ===== Navbar scroll & Visibility ===== */
const navbar = document.getElementById("navbar");
const categoryBar = document.querySelector(".category-bar");
let lastScrollTop = 0;

if (navbar && categoryBar) {
  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    if (scrollTop > lastScrollTop && scrollTop > 120) {
      navbar.classList.add("nav-hidden");
      categoryBar.classList.add("category-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
      categoryBar.classList.remove("category-hidden");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

/* ===== Mobile menu ===== */
function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.add('open');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
}

/* ===== Scroll reveal (IntersectionObserver) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.cat-card, .product-card, .testi-card, .about-feat, .contact-detail, section'
  ).forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});

/* ===== Contact form ===== */
function handleFormSubmit(e) {
  e.preventDefault();
  if (typeof showToast === 'function') {
    showToast('✉️ Message sent! We\'ll be in touch soon.');
  } else {
    alert('✉️ Message sent! We\'ll be in touch soon.');
  }
}

/* ===== Wishlist ===== */
function toggleWish(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('liked')) {
    icon.className = 'fas fa-heart';
    if (typeof showToast === 'function') showToast('❤️ Added to wishlist!');
  } else {
    icon.className = 'far fa-heart';
  }
}

/* ===== HERO CAROUSEL SLIDER ===== */
let slideIndex = 0;
let autoTimer;
let slides;
let dots;

document.addEventListener('DOMContentLoaded', () => {
  slides = document.getElementsByClassName("slides");
  dots = document.getElementsByClassName("dot");
  if (slides && slides.length > 0) {
    showSlide(0);
    startAuto();
  }
});

function showSlide(n) {
  if (!slides || !dots || slides.length === 0) return;

  if (n >= slides.length) n = 0;
  if (n < 0) n = slides.length - 1;
  slideIndex = n;

  for (let s of slides) s.style.display = "none";
  for (let d of dots) d.classList.remove("active-dot");

  slides[slideIndex].style.display = "block";
  slides[slideIndex].classList.remove("fade");
  void slides[slideIndex].offsetWidth;
  slides[slideIndex].classList.add("fade");

  if (dots[slideIndex]) dots[slideIndex].classList.add("active-dot");
}

function changeSlide(dir) {
  resetAuto();
  showSlide(slideIndex + dir);
}

function goToSlide(n) {
  resetAuto();
  showSlide(n - 1);
}

function startAuto() {
  autoTimer = setInterval(() => showSlide(slideIndex + 1), 4000);
}

function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}
