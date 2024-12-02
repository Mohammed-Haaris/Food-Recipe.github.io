/** @format */

const cardBody = $("#menu");
const dropdownCategoryList = $("#dropdownCategoryList"); // Navbar dropdown for categories

// Show loading indicator during AJAX requests
jQuery.ajaxSetup({
  beforeSend: function () {
    $("#loading-indicator").show();
  },
  complete: function () {
    $("#loading-indicator").hide();
  },
});

// Fetch and display recipe categories
function getReceipeApi() {
  const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
  $.ajax(url, {
    method: "GET",
    success: function (res) {
      const receipes = res["categories"];
      addReceipes(receipes);
      populateNavbarCategories(receipes); // Populate the navbar dropdown
    },
    error: function () {
      console.log("API error");
    },
  });
}

// Populate the categories in the navbar dropdown
function populateNavbarCategories(receipes) {
  dropdownCategoryList.empty(); // Clear existing categories in the dropdown

  receipes.forEach(function (receipe) {
    const categoryLink = $("<a></a>")
      .addClass("dropdown-item")
      .attr("href", "#")
      .text(receipe.strCategory)
      .click(function () {
        getMealsByCategory(receipe.strCategory); // Display meals of the selected category
      });

    dropdownCategoryList.append(categoryLink); // Add each category as a dropdown item
  });
}

function addReceipes(receipes) {
  for (let i = 0; i < receipes.length; i++) {
    const recipeDiv = generateCard(receipes[i]);
    cardBody.append(recipeDiv);
  }
}

function generateCard(receipe) {
  const colDiv = $("<div></div>")
    .addClass("col mt-5")
    .attr("id", receipe.idCategory);

  const cardDiv = $("<div></div>").addClass("card w-200").css("width", "18rem");

  const img = $("<img>")
    .addClass("card-img-top")
    .attr("src", receipe.strCategoryThumb)
    .attr("alt", "html");

  const cardBodyDiv = $("<div></div>").addClass("card-body");

  const cardTitle = $("<h5></h5>")
    .addClass("card-title")
    .text(receipe.strCategory);

  const cardText = $("<p></p>")
    .addClass("card-text text-truncate")
    .css("max-width", "100%")
    .text(receipe.strCategoryDescription);

  // Click event to display meals of the selected category
  colDiv.on("click", function () {
    getMealsByCategory(receipe.strCategory);
  });

  cardBodyDiv.append(cardTitle, cardText);
  cardDiv.append(img, cardBodyDiv);
  colDiv.append(cardDiv);

  return colDiv;
}

// Fetch meals by category
function getMealsByCategory(category) {
  const mealUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  $.ajax(mealUrl, {
    method: "GET",
    success: function (res) {
      const meals = res["meals"];
      displayMeals(meals, category);
    },
    error: function () {
      console.log("Failed to load meals.");
    },
  });
}

// Display meals for a selected category
function displayMeals(meals, category) {
  // Clear the current content
  cardBody.empty();

  // Set category title
  $("#category-title").text(`${category} Recipes`);

  // Generate meal cards
  for (let i = 0; i < meals.length; i++) {
    const mealDiv = generateMealCard(meals[i]);
    cardBody.append(mealDiv);
  }
}

// Generate a card for each meal
function generateMealCard(meal) {
  const colDiv = $("<div></div>").addClass("col mt-5").attr("id", meal.idMeal);

  const cardDiv = $("<div></div>").addClass("card w-200").css("width", "18rem");

  const img = $("<img>")
    .addClass("card-img-top")
    .attr("src", meal.strMealThumb)
    .attr("alt", "html");

  const cardBodyDiv = $("<div></div>").addClass("card-body");

  const cardTitle = $("<h5></h5>").addClass("card-title").text(meal.strMeal);

  // Click event to display meal details and ingredients
  colDiv.on("click", function () {
    displayMealDetails(meal.idMeal);
  });

  cardBodyDiv.append(cardTitle);
  cardDiv.append(img, cardBodyDiv);
  colDiv.append(cardDiv);

  return colDiv;
}

// Fetch meal details by meal ID
function displayMealDetails(mealId) {
  const mealUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  $.ajax(mealUrl, {
    method: "GET",
    success: function (res) {
      const meal = res["meals"][0];
      displayMealInfo(meal);
    },
    error: function () {
      console.log("Failed to load meal details.");
    },
  });
}

// Display meal details including ingredients
function displayMealInfo(meal) {
  // Clear the card body to show the meal details
  cardBody.empty();

  // Set meal title
  $("#category-title").text(`${meal.strMeal} Ingredients`);

  // Create a div to hold the meal details
  const mealDetailsDiv = $("<div></div>").addClass("meal-details");

  // Add meal image
  const img = $("<img>").attr("src", meal.strMealThumb).addClass("meal-image img-fluid");
  mealDetailsDiv.append(img);

  // Add meal ingredients
  const ingredientsList = $("<ul></ul>").addClass("ingredients-list");

  // Loop over the ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient) {
      const ingredientItem = $("<li></li>").text(`${ingredient} - ${measure}`);
      ingredientsList.append(ingredientItem);
    }
  }

  mealDetailsDiv.append("<h3 class='section-title'>Ingredients</h3>");
  mealDetailsDiv.append(ingredientsList);

  // Add meal instructions
  const instructionsList = $("<ol></ol>").addClass("instructions-list");

  const instructionsArray = meal.strInstructions
    .split("\n")
    .filter((step) => step.trim() !== "");
  instructionsArray.forEach((instruction, index) => {
    const instructionItem = $("<li></li>").text(instruction);
    instructionsList.append(instructionItem);
  });

  mealDetailsDiv.append(
    "<h3 class='section-title meal-instructions'>Instructions</h3>"
  );
  mealDetailsDiv.append(instructionsList);

  // Append meal details to the card body
  cardBody.append(mealDetailsDiv);
}

// On document ready, load the recipe categories
$(document).ready(function () {
  getReceipeApi();
});

// contact form submission
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get the values from the form fields
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create an object to store the form data
    const formData = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      timestamp: new Date().toLocaleString(), // Add timestamp
    };

    // Get existing data from local storage or initialize an empty array
    let storedData = localStorage.getItem("contactFormData");
    if (storedData) {
      storedData = JSON.parse(storedData); // Parse existing data
    } else {
      storedData = []; // Initialize if no data
    }

    // Add new form data to the array
    storedData.push(formData);

    // Store updated data back in local storage
    localStorage.setItem("contactFormData", JSON.stringify(storedData));

    // Optionally, display a success message
    alert("Your message has been saved successfully!");

    // Clear the form after submission
    contactForm.reset();
  });
});
