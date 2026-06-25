// ── STATE ────────────────────────────────
let cart = []; // { country, flag, size, price, qty }

// ── DOM ──────────────────────────────────
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsWrap = document.getElementById('cartItemsWrap');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const cartTotal = document.getElementById('cartTotal');
const toastWrap = document.getElementById('toastWrap');

// ── SIZE SELECTION ───────────────────────
document.querySelectorAll('.jersey-card').forEach(card => {
  const sizeBtns = card.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // ── ADD TO CART ─────────────────────────
  const addBtn = card.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    const selectedSize = card.querySelector('.size-btn.selected');
    if (!selectedSize) {
      showToast('Please select a size first');
      return;
    }
    const country = card.dataset.country;
    const flag = card.dataset.flag;
    const price = Number(card.dataset.price);
    const size = selectedSize.dataset.size;

    const existing = cart.find(i => i.country === country && i.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ country, flag, size, price, qty: 1 });
    }

    renderCart();
    showToast(`${country} jersey (${size}) added to cart`);
    bumpCartCount();
  });
});

// ── RENDER CART ──────────────────────────
function renderCart() {
  cartItemsWrap.innerHTML = '';

  if (cart.length === 0) {
    cartItemsWrap.appendChild(emptyCartMsg);
    emptyCartMsg.style.display = 'block';
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-left">
          <span class="flag">${item.flag}</span>
          <div>
            <h4>${item.country} ${item.qty > 1 ? `× ${item.qty}` : ''}</h4>
            <p>Size: ${item.size} · Home Kit 2026</p>
          </div>
        </div>
        <div class="cart-right">
          <span class="price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          <button class="remove-btn" data-index="${index}">✕</button>
        </div>
      `;
      cartItemsWrap.appendChild(row);
    });
  }

  // total count + price
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartCount.textContent = totalQty;
  cartTotal.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

  // wire up remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      cart.splice(idx, 1);
      renderCart();
    });
  });
}

function bumpCartCount() {
  cartCount.classList.add('bump');
  setTimeout(() => cartCount.classList.remove('bump'), 200);
}

// ── OPEN / CLOSE DRAWER ──────────────────
cartBtn.addEventListener('click', () => {
  cartOverlay.classList.add('open');
  cartDrawer.classList.add('open');
});
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
  cartOverlay.classList.remove('open');
  cartDrawer.classList.remove('open');
}

// ── CHECKOUT (placeholder) ───────────────
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  showToast('Checkout coming soon!');
});

// ── TOASTS ────────────────────────────────
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastWrap.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ── SMART FIT ASSISTANT ──────────────────
document.getElementById('fitBtn').addEventListener('click', () => {
  const height = Number(document.getElementById('heightInput').value);
  const weight = Number(document.getElementById('weightInput').value);
  const bmi = weight / ((height / 100) ** 2);

  let size, desc;
  if (height < 160 || bmi < 18.5) {
    size = 'S'; desc = 'A snug, athletic fit for your frame.';
  } else if (height < 175 || bmi < 23) {
    size = 'M'; desc = 'A balanced, true-to-size fit.';
  } else if (height < 188 || bmi < 27) {
    size = 'L'; desc = 'A relaxed fit with room to move.';
  } else {
    size = 'XL'; desc = 'A roomier fit for taller/broader builds.';
  }

  document.getElementById('fitSize').textContent = size;
  document.getElementById('fitDesc').textContent = desc;
  document.getElementById('fitResult').classList.add('show');
});

// ── REVEAL ON SCROLL ──────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ── LIVE STOCK COUNTDOWN ──────────────────
const stockNum = document.getElementById('stockNum');
setInterval(() => {
  let current = Number(stockNum.textContent);
  if (current > 3 && Math.random() < 0.3) {
    stockNum.textContent = current - 1;
  }
}, 8000);

// ── FLOATING PARTICLE BACKGROUND ─────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
  particles = [];
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      speedY: 0.2 + Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.1 + Math.random() * 0.3
    });
  }
}
createParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.y -= p.speedY;
    p.x += p.speedX;
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();