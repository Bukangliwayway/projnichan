document
  .getElementById("logout-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      window.location.href = "index.html";
    }
  });

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

// Call the function after populating the grid
populateGrid("blue", "blue-grid");
populateGrid("violet", "violet-grid");
populateGrid("green", "green-grid");
populateGrid("yellow", "yellow-grid");
addClickAnimation();

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

  // Function to filter items based on the search query
  const filterItems = (query) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Handle Search Bar Input
  const resultsBox = document.getElementById(".result-box");
  const inputBox = document.getElementById("input-box");

  resultsBox.addEventListener("input", (event) => {
    const query = event.target.value.trim();
    const filteredItems = filterItems(query);
    let results = [];
    let input = inputBox.value;
    if (input.length) {
      result = availableItems.filter((item) => {
        return item.toLowerCase.include(input.toLowerCase());
      });
    }
    function displayResults(results) {
      const html = results.map;
    }

    // Clear previous search results
    searchResults.innerHTML = "";

    if (query === "") {
      searchResults.innerHTML = `<div class="no-results">Start typing to search...</div>`;
      return;
    }

    if (filteredItems.length === 0) {
      searchResults.innerHTML = `<div class="no-results">No results found</div>`;
      return;
    }

    // Display filtered results
    filteredItems.forEach((item) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.style.backgroundImage = `url(${item.bgImage})`;
      div.innerHTML = `<strong>${item.name}</strong><span>${item.price}</span>`;
      div.addEventListener("click", () => {
        displayInRightBar(item);
      });
      searchResults.appendChild(div);
    });
  });

  // Display item in the right bar
  const displayInRightBar = (item) => {
    const rightBarImage = document.querySelector(".right-bar-image");
    const rightBarName = document.querySelector(".right-bar-name");
    const rightBarPrice = document.querySelector(".right-bar-price");

    // Update right bar content
    rightBarImage.style.backgroundImage = `url(${item.bgImage})`;
    rightBarName.textContent = item.name;
    rightBarPrice.textContent = item.price;

    // Show the right bar content
    document.querySelector(".right-bar").classList.add("item-selected");
  };
}
// Populate Grids for Classic and Premium Milktea
populateGrid("classic-milktea", "classic-milktea-grid");
populateGrid("premium-milktea", "premium-milktea-grid");

// Logout Functionality
function handleLogout() {
  // Redirect to the login page
  window.location.href = "index.html";
}

// Attach the logout function to the logout button
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      handleLogout(); // Call the logout function
    });
  }
});
