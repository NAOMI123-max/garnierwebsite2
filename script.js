// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Add to Cart buttons logic on products.html
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  if (addToCartButtons.length) {
    addToCartButtons.forEach(button => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));
        const image = button.getAttribute("data-image") || "images/default.jpg";
        addToCart(name, price, image);
      });
    });
  }

  // Display cart on cart.html
  if (document.getElementById("cart-table-body")) {
    renderCart();
  }

  // Feedback form submission
  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", e => {
      e.preventDefault();
      submitFeedback();
    });
  }
});

// Cart functions
function getCart() {
  return JSON.parse(localStorage.getItem("garnierCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("garnierCart", JSON.stringify(cart));
}

function addToCart(name, price, image) {
  let cart = getCart();
  let found = cart.find(item => item.name === name);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  saveCart(cart);
  alert(`${name} added to cart!`);
}

function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById("cart-table-body");
  const totalSpan = document.getElementById("cart-total");
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>';
    totalSpan.textContent = "0.00";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" data-index="${index}" class="form-control qty-input" style="width: 70px; margin: 0 auto;" />
      </td>
      <td>${itemTotal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button></td>
    `;

    tbody.appendChild(tr);
  });

  totalSpan.textContent = total.toFixed(2);

  // Attach events for qty changes and remove buttons
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", e => {
      const index = e.target.getAttribute("data-index");
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      e.target.value = val;
      updateQty(index, val);
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.getAttribute("data-index");
      removeItem(index);
    });
  });

  // Checkout button event
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      alert(
        `Thank you for your purchase! Total: $${total.toFixed(
          2
        )}\n(This is a demo, no real transaction occurs.)`
      );
      localStorage.removeItem("garnierCart");
      renderCart();
    };
  }
}
tr.innerHTML = `
  <td><img src="${item.image}" alt="${item.name}" width="50"></td>
  <td>${item.name}</td>
  <td>${item.price.toFixed(2)}</td>
  <td>
    <input type="number" min="1" value="${item.qty}" data-index="${index}" class="form-control qty-input" style="width: 70px; margin: 0 auto;" />
  </td>
  <td>${itemTotal.toFixed(2)}</td>
  <td><button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button></td>
`;

function updateQty(index, qty) {
  let cart = getCart();
  cart[index].qty = qty;
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Feedback form submission (demo)
function submitFeedback() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const responseDiv = document.getElementById("feedback-response");

  if (!name || !email || !message) {
    responseDiv.style.color = "red";
    responseDiv.textContent = "Please fill in all required fields.";
    return;
  }

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    responseDiv.style.color = "red";
    responseDiv.textContent = "Please enter a valid email address.";
    return;
  }

  // In real site, here would be AJAX to backend. For demo:
  responseDiv.style.color = "#28a745";
  responseDiv.textContent = `Thank you, ${name}! Your feedback has been received.`;

  // Reset form
  document.getElementById("feedback-form").reset();
}
