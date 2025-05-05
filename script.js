document
  .getElementById("logout-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      window.location.href = "index.html";
    }
  });

let searchTerm = "";

// Populate Grids
const populateGrid = (section, bodyId) => {
  console.log(`Populating ${section} grid with search term: "${searchTerm}"`);
  const bodyElement = document.getElementById(bodyId);

  // Clear any existing content
  bodyElement.innerHTML = "";

  // Get all items for this section
  let sectionItems = data.filter((item) => item.section === section);

  // Apply search filter if there is a search term
  if (searchTerm) {
    sectionItems = sectionItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
  }

  // If no items match the search, show a no results message
  if (sectionItems.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results-message";
    noResults.textContent = `No items found in this section for "${searchTerm}"`;
    bodyElement.appendChild(noResults);
    return;
  }

  // Get unique subsections
  const subsections = [...new Set(sectionItems.map((item) => item.subSection))];

  // For each subsection, create a grid
  subsections.forEach((subsection) => {
    const subsectionItems = sectionItems.filter(
      (item) => item.subSection === subsection
    );

    // Skip empty subsections
    if (subsectionItems.length === 0) return;

    // Create subsection container
    const subsectionContainer = document.createElement("div");
    subsectionContainer.className = "subsection-container";

    // Create subsection header
    const subsectionHeader = document.createElement("h2");
    subsectionHeader.className = "subsection-header";
    subsectionHeader.textContent =
      subsection.charAt(0).toUpperCase() + subsection.slice(1);
    subsectionContainer.appendChild(subsectionHeader);

    // Create grid for this subsection
    const grid = document.createElement("div");
    grid.className = "grid";
    grid.id = `${section}-${subsection}-grid`;
    subsectionContainer.appendChild(grid);

    // Append the subsection container to the body
    bodyElement.appendChild(subsectionContainer);

    // Populate the grid with items
    subsectionItems.forEach((item) => {
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
  });

  // Add click animations to the newly created grid items
  addClickAnimation();
};

const addClickAnimation = () => {
  const gridItems = document.querySelectorAll(".grid .item");

  gridItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Add the animation class
      item.classList.add("animate-image");

      // Remove the animation class after the animation ends
      setTimeout(() => {
        item.classList.remove("animate-image");
      }, 1000); // Match the duration of the animation in CSS
    });
  });
};

// Update the initial call to populateGrid
populateGrid("blue", "blue-body");
populateGrid("violet", "violet-body");
populateGrid("green", "green-body");
populateGrid("yellow", "yellow-body");
// Call the function after populating grids
addClickAnimation();

// Sidebar Toggle
const sidebarItems = document.querySelectorAll(".sidebar .item");
const bodies = document.querySelectorAll(".main-body");

// Sidebar Toggle
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all items and bodies
    sidebarItems.forEach((i) => i.classList.remove("active"));
    bodies.forEach((body) => body.classList.remove("active"));

    // Add active class to clicked item and corresponding body
    item.classList.add("active");
    const bodyId = item.getAttribute("data-body");
    document.getElementById(bodyId).classList.add("active");

    // Clear the search term when switching tabs
    searchTerm = "";
    if (document.getElementById("search-bar")) {
      document.getElementById("search-bar").value = "";
    }

    // Re-populate all grids with unfiltered data
    populateGrid("blue", "blue-body");
    populateGrid("violet", "violet-body");
    populateGrid("green", "green-body");
    populateGrid("yellow", "yellow-body");
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
  const actionButtons = document.querySelector(".action-buttons");
  const addOnsSection = document.querySelector(".add-ons");
  const optionsSection = document.querySelector(".options");

  // Show the right bar content and sections
  document.querySelector(".right-bar").classList.add("item-selected");
  actionButtons.style.display = "flex";
  addOnsSection.style.display = "block";
  optionsSection.style.display = "block";

  // Update right bar content
  rightBarImage.style.backgroundImage = `url(${item.bgImage})`;
  rightBarName.textContent = item.name;
  rightBarPrice.textContent = item.price;
  quantityElement.textContent = "1"; // Reset quantity to 1
  // Store the selected item for calculations
  selectedItem = item;
  quantity = 1;
};

// Add-On Prices
const addOnPrices = {
  pearl: 10,
  nata: 10,
  "coffee-jelly": 15,
  espresso: 50,
};

// Add-On Counts
const addOnCounts = {
  pearl: 0,
  nata: 0,
  "coffee-jelly": 0,
  espresso: 0,
};

// Update Add-On Counts and Total Price
const updateAddOnCount = (addOn, increment) => {
  if (increment) {
    addOnCounts[addOn]++;
  } else if (addOnCounts[addOn] > 0) {
    addOnCounts[addOn]--;
  }

  // Update the count display
  document.getElementById(`${addOn}-count`).textContent = addOnCounts[addOn];

  // Recalculate the total price
  updateTotalPrice(selectedItem);
};

// Add event listeners for add-on buttons
document.querySelectorAll(".add-on-increase").forEach((button) => {
  button.addEventListener("click", () => {
    const addOn = button.getAttribute("data-add-on");
    updateAddOnCount(addOn, true);
  });
});

document.querySelectorAll(".add-on-decrease").forEach((button) => {
  button.addEventListener("click", () => {
    const addOn = button.getAttribute("data-add-on");
    updateAddOnCount(addOn, false);
  });
});

// Update Total Price (including add-ons)
const updateTotalPrice = (item) => {
  if (!item) return;

  const totalPriceElement = document.getElementById("total-price");
  const basePrice = parseFloat(item.price.replace("$", ""));
  const addOnTotal = Object.keys(addOnCounts).reduce((sum, addOn) => {
    return sum + addOnCounts[addOn] * addOnPrices[addOn];
  }, 0);

  const total = basePrice * quantity + addOnTotal;

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


document.getElementById("order-now").addEventListener("click", () => {
  if (selectedItem) {
    // Gather add-ons information
    let addOnsMessage = [];
    for (const [addOn, count] of Object.entries(addOnCounts)) {
      if (count > 0) {
        // Format add-on name to be more readable
        const formattedName = addOn
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        addOnsMessage.push(`${count} ${formattedName}`);
      }
    }

    // Get options information
    const lessIce = document.getElementById("less-ice").checked;
    const dineOption = document.querySelector(
      'input[name="dine-option"]:checked'
    )?.value;

    // Build the complete order message
    let orderMessage = `Order placed for ${quantity} ${selectedItem.name}(s)!\n`;

    // Add add-ons if any were selected
    if (addOnsMessage.length > 0) {
      orderMessage += `\nWith add-ons:\n- ${addOnsMessage.join("\n- ")}`;
    }

    // Add options if selected
    if (lessIce || dineOption) {
      orderMessage += "\n\nOptions:";
      if (lessIce) orderMessage += "\n- Less Ice";
      if (dineOption)
        orderMessage += `\n- ${
          dineOption === "dine-in" ? "Dine In" : "Take Out"
        }`;
    }

    // Show total price
    const totalPrice = document.getElementById("total-price").textContent;
    orderMessage += `\n\nTotal: ${totalPrice}`;

    alert(orderMessage);
  } else {
    alert("Please select an item first!");
  }
});

// ...existing code...

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
    // Redirect to Admin Dashboard
    window.location.href = "admin-dashboard.html";
  } else if (username === staffUsername && password === staffPassword) {
    // Redirect to Staff Dashboard
    window.location.href = "staff-dashboard.html";
  } else {
    // Show error message for invalid credentials
    document.getElementById("message").innerText =
      "Invalid Username or Password!";
  }
}

// Now set up the search event listener in the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("search-bar");

  // Search functionality that re-triggers grid population
  searchBar.addEventListener("input", function () {
    searchTerm = searchBar.value.trim().toLowerCase();
  
    // Re-populate all grids with filtered data
    populateGrid("blue", "blue-body");
    populateGrid("violet", "violet-body");
    populateGrid("green", "green-body");
    populateGrid("yellow", "yellow-body");
  
    // Re-add click animations
    addClickAnimation();
  });
});

// Global cart array to store items
const cart = [];
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");

// Add to Cart Button Functionality
document.getElementById("add-to-cart").addEventListener("click", () => {
  if (!selectedItem) {
    alert("Please select an item first!");
    return;
  }

  const itemName = selectedItem.name;
  const itemPrice = parseFloat(selectedItem.price.replace("₱", ""));
  const itemImage = selectedItem.image; // Get the image URL from the selected item
  const quantity = parseInt(document.getElementById("quantity").textContent);

  // Check if the item already exists in the cart
  const existingItem = cart.find((item) => item.name === itemName);
  if (existingItem) {
    existingItem.quantity += quantity; // Update quantity if item exists
  } else {
    cart.push({ name: itemName, price: itemPrice, image: itemImage, quantity }); // Add new item to cart
  }

  updateCart(); // Update the cart display
});

// Update Cart Display
function updateCart() {
  cartItemsContainer.innerHTML = ""; // Clear existing cart items
  let total = 0;

  // Check if the cart is empty
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalPrice.textContent = "₱0.00";
    return;
  }

  // Loop through the cart items and create HTML for each item
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartListItem = document.createElement("div");
    cartListItem.classList.add("cart-list-item");
    cartListItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₱${item.price.toFixed(2)}</span>
      </div>
      <div class="quantity-controls">
        <button onclick="decreaseCartItem(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseCartItem(${index})">+</button>
      </div>
      <span class="cart-item-total">₱${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartItemsContainer.appendChild(cartListItem);
  });

  // Update the total price in the cart
  cartTotalPrice.textContent = `₱${total.toFixed(2)}`;
}

// Increase Cart Item Quantity
function increaseCartItem(index) {
  cart[index].quantity++;
  updateCart();
}

// Decrease Cart Item Quantity
function decreaseCartItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    if (confirm(`Remove ${cart[index].name} from the cart?`)) {
      cart.splice(index, 1); // Remove item if quantity is 0
    }
  }
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = ""; // Clear existing cart items
  let total = 0;

  // Check if the cart is empty
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalPrice.textContent = "₱0.00";
    return;
  }

  // Create a list container for cart items
  const cartList = document.createElement("ul");
  cartList.classList.add("cart-list");

  // Loop through the cart items and create list items
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartListItem = document.createElement("li");
    cartListItem.classList.add("cart-list-item");
    cartListItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.name}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₱${item.price.toFixed(2)}</span>
      </div>
      <div class="quantity-controls">
        <button onclick="decreaseCartItem(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseCartItem(${index})">+</button>
      </div>
      <span class="cart-item-total">₱${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartList.appendChild(cartListItem);
  });

  cartItemsContainer.appendChild(cartList); // Append the list to the cart container

  // Update the total price in the cart
  cartTotalPrice.textContent = `₱${total.toFixed(2)}`;
}
function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity if item already exists
  } else {
    cart.push({
      name: item.name,
      price: parseFloat(item.price.replace("php", "")), // Parse price as a number
      image: item.bgImage, // Add the image from data.js
      quantity: 1, // Default quantity
    });
  }

  updateCart(); // Update the cart display
}

