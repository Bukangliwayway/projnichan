// Populate Grids
const populateGrid = (section, gridId) => {
  const grid = document.getElementById(gridId);
  const items = data.filter((item) => item.section === section);
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.style.backgroundImage = `url(${item.bgImage})`;
    div.innerHTML = `<strong>${item.name}</strong><span>${item.price}</span>`;
    div.addEventListener("click", () => {
      displayInRightBar(item);
      document.querySelector(".right-bar").classList.add("item-selected");
      updateTotalPrice(item);
    });
    grid.appendChild(div);
  });
};

populateGrid("blue", "blue-grid");
populateGrid("green", "green-grid");
populateGrid("yellow", "yellow-grid");

// Sidebar Toggle
const sidebarItems = document.querySelectorAll(".sidebar .item");
const bodies = document.querySelectorAll(".main-body");

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all items and bodies
    sidebarItems.forEach((i) => i.classList.remove("active"));
    bodies.forEach((body) => body.classList.remove("active"));

    // Add active class to clicked item and corresponding body
    item.classList.add("active");
    const bodyId = item.getAttribute("data-body");
    document.getElementById(bodyId).classList.add("active");
  });
});

// Global variable to track selected item
let selectedItem = null;

// Display item in the right bar
const displayInRightBar = (item) => {
  const rightBarImage = document.querySelector(".right-bar-image");
  const rightBarName = document.querySelector(".right-bar-name");
  const rightBarPrice = document.querySelector(".right-bar-price");
  const quantityElement = document.getElementById("quantity");

  // Update right bar content
  rightBarImage.style.backgroundImage = `url(${item.bgImage})`;
  rightBarName.textContent = item.name;
  rightBarPrice.textContent = item.price;
  quantityElement.textContent = "1"; // Reset quantity to 1

  // Store the selected item for calculations
  selectedItem = item;
  quantity = 1;
};

// Function to update total price
const updateTotalPrice = (item) => {
  if (!item) return;

  const totalPriceElement = document.getElementById("total-price");
  // Extract numeric value from price (removing $ sign)
  const price = parseFloat(item.price.replace("$", ""));
  const total = price * quantity;

  // Format with peso sign
  totalPriceElement.textContent = `₱${total.toFixed(2)}`;
};

// Quantity controls
const quantityElement = document.getElementById("quantity");
let quantity = 1;

document.getElementById("increase-quantity").addEventListener("click", () => {
  quantity++;
  quantityElement.textContent = quantity;
  if (selectedItem) {
    updateTotalPrice(selectedItem);
  }
});

document.getElementById("decrease-quantity").addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityElement.textContent = quantity;
    if (selectedItem) {
      updateTotalPrice(selectedItem);
    }
  }
});

// Action buttons
document.getElementById("add-to-cart").addEventListener("click", () => {
  if (selectedItem) {
    alert(`${quantity} ${selectedItem.name}(s) added to cart!`);
  } else {
    alert("Please select an item first!");
  }
});

document.getElementById("order-now").addEventListener("click", () => {
  if (selectedItem) {
    alert(`Order placed for ${quantity} ${selectedItem.name}(s)!`);
  } else {
    alert("Please select an item first!");
  }
});

function togglePassword() {
  let passwordField = document.getElementById("password");
  let eyeIcon = document.getElementById("eyeIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.innerHTML =
      '<path d="M17.94 17.94A10.49 10.49 0 0112 19c-7 0-11-7-11-7a18.18 18.18 0 015.07-5.08M9.88 9.88A3 3 0 0112 9a3 3 0 013 3c0 .85-.34 1.61-.88 2.12M1 1l22 22"></path>';
  } else {
    passwordField.type = "password";
    eyeIcon.innerHTML =
      '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle>';
  }
}

function checkLogin(event) {
  event.preventDefault(); // Prevent form submission

  // Admin credentials
  const adminUsername = "admin";
  const adminPassword = "12345";
  // Staff credentials
  const staffUsername = "staff";
  const staffPassword = "12345";

  // Get input values
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Check if credentials match for Admin or Staff
  if (username === adminUsername && password === adminPassword) {
    alert("Admin Login successful! Redirecting...");
    window.location.href = "admin-dashboard.html"; // Admin dashboard page
  } else if (username === staffUsername && password === staffPassword) {
    alert("Staff Login successful! Redirecting...");
    window.location.href = "staff-dashboard.html"; // Staff dashboard page
  } else {
    document.getElementById("message").innerText =
      "Invalid Username or Password!";
  }
}
