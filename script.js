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
  console.log(data);

  // Apply search filter if there is a search term
  if (searchTerm) {
    console.log(`Filtering ${sectionItems.length} items by search term`);
    sectionItems = sectionItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    console.log(`After filtering: ${sectionItems.length} items remain`);
    console.log(searchTerm);
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
  console.log(`Found ${subsections.length} subsections for ${section}`);

  // For each subsection, create a grid
  subsections.forEach((subsection) => {
    // Get items for this subsection, already filtered by search term
    const subsectionItems = sectionItems.filter(
      (item) => item.subSection === subsection
    );

    // Skip empty subsections
    if (subsectionItems.length === 0) {
      console.log(`Skipping empty subsection: ${subsection}`);
      return;
    }

    // Create subsection container
    const subsectionContainer = document.createElement("div");
    subsectionContainer.className = "subsection-container";

    // Create subsection header
    const subsectionHeader = document.createElement("h2");
    subsectionHeader.className = "subsection-header";
    subsectionHeader.textContent =
      subsection.charAt(0).toUpperCase() + subsection.slice(1); // Capitalize first letter
    subsectionContainer.appendChild(subsectionHeader);

    // Create grid for this subsection
    const grid = document.createElement("div");
    grid.className = "grid";
    grid.id = `${section}-${subsection}-grid`;
    subsectionContainer.appendChild(grid);

    // Append the subsection container to the body
    bodyElement.appendChild(subsectionContainer);

    // Populate the grid with items
    console.log(`Adding ${subsectionItems.length} items to ${subsection} grid`);
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
    console.log("Search term updated:", searchTerm);

    // Re-populate all grids with filtered data
    populateGrid("blue", "blue-body");
    populateGrid("violet", "violet-body");
    populateGrid("green", "green-body");
    populateGrid("yellow", "yellow-body");

    // Re-add click animations
    addClickAnimation();
  });
});
