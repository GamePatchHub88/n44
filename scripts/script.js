// ========== العناصر ==========
const cards = document.querySelectorAll(".product-card");
const cartCount = document.querySelector(".cart__count");
const cartEmpty = document.querySelector(".cart__empty");
const cartFilled = document.querySelector(".cart__filled");
const cartList = document.querySelector(".cart__list");
const cartTotal = document.querySelector(".cart__order-total-value");
const confirmBtn = document.querySelector(".cart__confirm");

const modal = document.querySelector(".modal");
const modalList = document.querySelector(".modal__list");
const modalTotal = document.querySelector(".modal__order-total-value");
const newOrderBtn = document.querySelector(".modal__new-order");

// ========== البيانات ==========
// مفتاح: اسم المنتج  |  قيمة: { price, quantity, thumb }
const cart = {};

// ========== دوال مساعدة ==========
const formatPrice = (n) => `$${n.toFixed(2)}`;

function getProduct(card) {
  const name = card.querySelector(".product-card__name").textContent.trim();
  const price = parseFloat(
    card.querySelector(".product-card__price").textContent.replace("$", ""),
  );
  const imageSrc = card.querySelector(".product-card__image").getAttribute("src");
  const thumb = imageSrc.replace("-mobile", "-thumbnail");
  return { name, price, thumb };
}

// ========== رسم السلة ==========
function renderCart() {
  const items = Object.entries(cart);

  const totalQty = items.reduce((sum, [, item]) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, [, item]) => sum + item.price * item.quantity,
    0,
  );

  // العداد وحالتا السلة
  cartCount.textContent = totalQty;
  cartEmpty.hidden = items.length > 0;
  cartFilled.hidden = items.length === 0;

  // عناصر السلة
  cartList.innerHTML = items
    .map(
      ([name, item]) => `
      <li class="cart-item">
        <div class="cart-item__details">
          <h3 class="cart-item__name">${name}</h3>
          <p class="cart-item__summary">
            <span class="cart-item__quantity">${item.quantity}x</span>
            <span class="cart-item__unit-price">@ ${formatPrice(item.price)}</span>
            <span class="cart-item__total">${formatPrice(item.price * item.quantity)}</span>
          </p>
        </div>
        <button class="cart-item__remove" type="button" aria-label="Remove ${name}">
          <img src="./assets/images/icon-remove-item.svg" alt="" />
        </button>
      </li>`,
    )
    .join("");

  cartTotal.textContent = formatPrice(totalPrice);

  // مزامنة كروت المنتجات (الزر / العداد / الكمية)
  cards.forEach((card) => {
    const { name } = getProduct(card);
    const qty = cart[name] ? cart[name].quantity : 0;

    card.querySelector(".product-card__add").hidden = qty > 0;
    card.querySelector(".product-card__quantity").hidden = qty === 0;
    card.querySelector(".product-card__quantity-value").textContent = qty || 1;
  });
}

// ========== أزرار الكروت ==========
cards.forEach((card) => {
  const addBtn = card.querySelector(".product-card__add");
  const incBtn = card.querySelector(".product-card__quantity-btn--increment");
  const decBtn = card.querySelector(".product-card__quantity-btn--decrement");

  addBtn.addEventListener("click", () => {
    const { name, price, thumb } = getProduct(card);
    cart[name] = { price, quantity: 1, thumb };
    renderCart();
  });

  incBtn.addEventListener("click", () => {
    const { name } = getProduct(card);
    cart[name].quantity += 1;
    renderCart();
  });

  decBtn.addEventListener("click", () => {
    const { name } = getProduct(card);
    cart[name].quantity -= 1;
    if (cart[name].quantity === 0) delete cart[name];
    renderCart();
  });
});

// ========== إزالة عنصر من السلة (event delegation) ==========
cartList.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".cart-item__remove");
  if (!removeBtn) return;

  const name = removeBtn
    .closest(".cart-item")
    .querySelector(".cart-item__name").textContent;

  delete cart[name];
  renderCart();
});

// ========== المودال ==========
confirmBtn.addEventListener("click", () => {
  const items = Object.entries(cart);
  const totalPrice = items.reduce(
    (sum, [, item]) => sum + item.price * item.quantity,
    0,
  );

  modalList.innerHTML = items
    .map(
      ([name, item]) => `
      <li class="modal-item">
        <img class="modal-item__thumb" src="${item.thumb}" alt="" />
        <div class="modal-item__details">
          <h3 class="modal-item__name">${name}</h3>
          <p class="modal-item__summary">
            <span class="modal-item__quantity">${item.quantity}x</span>
            <span class="modal-item__unit-price">@ ${formatPrice(item.price)}</span>
          </p>
        </div>
        <p class="modal-item__total">${formatPrice(item.price * item.quantity)}</p>
      </li>`,
    )
    .join("");

  modalTotal.textContent = formatPrice(totalPrice);
  modal.hidden = false;
});

newOrderBtn.addEventListener("click", () => {
  Object.keys(cart).forEach((name) => delete cart[name]);
  modal.hidden = true;
  renderCart();
});

// رسم أولي: يخفي العناصر التجريبية الموجودة في الـ HTML
renderCart();