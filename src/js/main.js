/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

import { MealsRepository } from "./logic/meals/repository_meals.js";
import { ProductsRepository } from "./logic/products/repository_products.js";

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("popstate", router);

function router() {
  const path = location.pathname;

  if (path.startsWith("/meal/")) {
    loadMealFromURL();
  } else {
    displayContent();
  }
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    showSection(section);
  });
});

const sections = {
  meals: [
    "search-filters-section",
    "meal-categories-section",
    "all-recipes-section",
  ],
  details: ["meal-details"],
  products: ["products-section"],
  foodlog: ["foodlog-section"],
};

const headers = {
  meals: {
    title: "Meals & Recipes",
    subtitle: "Discover delicious and nutritious recipes tailored for you",
  },
  details: {
    title: "Recipe Details",
    subtitle: "View full recipe information and nutrition facts",
  },
  products: {
    title: "Product Scanner",
    subtitle: "Search and scan packaged food products",
  },
  foodlog: {
    title: "Food Log",
    subtitle: "Track and monitor your daily nutrition intake",
  },
};

var foodLogs = [];

showSection("meals");

function showSection(sectionKey, isDetails = false) {
  // hide all sections
  document
    .querySelectorAll("#main-content section")
    .forEach((sec) => sec.classList.add("hidden"));

  // show target sections
  sections[sectionKey].forEach((id) => {
    document.getElementById(id)?.classList.remove("hidden");
  });

  updateHeader(sectionKey);
  if ((sectionKey = "products")) {
    getProductCategories();
  }
  if ((sectionKey = "foodlog")) {
    console.log(sectionKey);
    displayFoodLog();
  }
  if (!isDetails) {
    setActiveNav(sectionKey);
  }
}

function updateHeader(key) {
  document.querySelector("#header h1").textContent = headers[key].title;

  document.querySelector("#header p").textContent = headers[key].subtitle;
}

function setActiveNav(key) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("bg-emerald-50", "text-emerald-700", "font-semibold");
    link.classList.add("text-gray-600");
  });

  const active = document.querySelector(`.nav-link[data-section="${key}"]`);

  active.classList.add("bg-emerald-50", "text-emerald-700", "font-semibold");
}

var mealsGridView = document.getElementById("grid-view-btn");
var mealsListView = document.getElementById("list-view-btn");

var mealsGrid = true;

mealsGridView.addEventListener("click", function () {
  document
    .getElementById("recipes-grid")
    .classList.remove("grid-cols-2", "gap-4");
  mealsListView.classList.remove("bg-white", "rounded-md", "shadow-sm");
  document.getElementById("recipes-grid").classList.add("grid-cols-4", "gap-5");
  mealsGridView.classList.add("bg-white", "rounded-md", "shadow-sm");
  displayMeals(meals);
  mealsGrid = true;
});

mealsListView.addEventListener("click", function () {
  document
    .getElementById("recipes-grid")
    .classList.remove("grid-cols-4", "gap-5");
  mealsGridView.classList.remove("bg-white", "rounded-md", "shadow-sm");
  document.getElementById("recipes-grid").classList.add("grid-cols-2", "gap-4");
  mealsListView.classList.add("bg-white", "rounded-md", "shadow-sm");
  displayListMeals(meals);
  mealsGrid = false;
});

var selectedCategory = "";
var selectedArea = "";

function showLoading() {
  const loader = document.getElementById("app-loading-overlay");
  loader.style.display = "flex"; // 🔥 مهم
  loader.classList.remove("opacity-0");
}

function hideLoading() {
  const loader = document.getElementById("app-loading-overlay");
  loader.classList.add("opacity-0");

  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
}

document
  .getElementById("categories-grid")
  .addEventListener("click", async (e) => {
    const card = e.target.closest(".category-card");
    if (!card) return;

    selectedCategory = card.dataset.category;
    console.log("Selected category:", selectedCategory);

    document.getElementById(
      "recipes-grid"
    ).innerHTML = `<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>`;

    meals = await MealsRepository.filterMeals(selectedCategory, selectedArea);

    displayMeals(meals, selectedCategory);
  });

document.getElementById("areas-grid").addEventListener("click", async (e) => {
  const btn = e.target.closest(".area-btn");
  if (!btn) return; // لو ضغط بره الزرار

  selectedArea = btn.dataset.area;

  // شيل active من الكل
  document.querySelectorAll(".area-btn").forEach((b) => {
    b.classList.remove("bg-emerald-600", "text-white");
    b.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
  });

  // ضيف active للزرار الحالي
  btn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
  btn.classList.add("bg-emerald-600", "text-white");

  console.log("Selected area:", selectedArea);

  if (selectedArea) {
    meals = await MealsRepository.getMealsRandom();
  } else {
    meals = await MealsRepository.filterMeals(selectedCategory, selectedArea);
  }

  displayMeals(meals, selectedCategory);
});

var meals;

async function displayContent() {
  try {
    showLoading();
    var areas = await MealsRepository.getAreas();
    displayAreas(areas);
    var categories = await MealsRepository.getCategories();
    displayCategories(categories);
    meals = await MealsRepository.getMealsRandom();

    displayMeals(meals);
  } catch (e) {
    console.error(e);
  } finally {
    hideLoading();
  }
}

displayContent();

function displayAreas(data) {
  var areasContent = `<button
              class="area-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
              data-area="All"
            >
              All Recipes
            </button>`;
  for (var i = 0; i < data.length; i++) {
    areasContent += `<button
              class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
              data-area="${data[i].name}"
            >
              ${data[i].name}
            </button>`;
  }
  document.getElementById("areas-grid").innerHTML = areasContent;
}

function displayCategories(data) {
  let categoriesContent = "";

  for (let i = 0; i < data.length; i++) {
    const defaultCategoryStyle = {
      color: "gray",
      icon: "fa-utensils",
    };
    const style = categoryStyle[data[i].name] ?? defaultCategoryStyle;

    categoriesContent += `
        <div
          class="category-card 
                 bg-${style.color}-50 
                 border-${style.color}-200
                 rounded-xl p-3 border
                 hover:border-${style.color}-400
                 hover:shadow-md cursor-pointer transition-all group"
          data-category="${data[i].name}"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="text-white w-9 h-9 
                     bg-${style.color}-500
                     rounded-lg flex items-center justify-center
                     group-hover:scale-110 transition-transform shadow-sm"
            >
              <i class="fa-solid ${style.icon}"></i>
            </div>
  
            <h3 class="text-sm font-bold text-gray-900">
              ${data[i].name}
            </h3>
          </div>
        </div>
      `;
  }

  document.getElementById("categories-grid").innerHTML = categoriesContent;
}

function displayMeals(data, category = "") {
  let mealsContent = "";
  document.getElementById(
    "recipes-count"
  ).innerHTML = `Showing ${data.length} ${category} recipes`;
  for (let i = 0; i < data.length; i++) {
    if (mealsGrid) {
      mealsContent += `<div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${data[i].id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${data[i].thumbnail}"
                  alt="${data[i].name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${data[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                  ${data[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                ${data[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                ${data[i].instructions[0]}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${data[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${data[i].area}
                  </span>
                </div>
              </div>
            </div>`;
    } else {
      mealsContent += `<div 
      class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-row h-40" 
      data-meal-id="52795">
      <div class="relative overflow-hidden w-48 h-full">
          <img 
          class="w-full object-cover group-hover:scale-110 transition-transform duration-500 h-full" 
          src="${data[i].thumbnail}" 
          alt="${data[i].name}" 
          loading="lazy">
      </div>
      <div class="p-4">
          <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              Chicken Handi
          </h3>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
              Take a large pot or wok, big enough to cook all the chicken, and heat the oil in it. Once the oil is...
          </p>
          <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-900">
                  <i class="mr-1 text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                  Chicken
              </span>
              <span class="font-semibold text-gray-500">
                  <i class="mr-1 text-blue-500" data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg></i>
                  Indian
              </span>
          </div>
      </div>
  </div>`;
    }
  }

  document.getElementById("recipes-grid").innerHTML = mealsContent;
}

document.getElementById("back-to-meals-btn").addEventListener("click", () => {
  showSection("meals");
});

document.getElementById("recipes-grid").addEventListener("click", async (e) => {
  const card = e.target.closest(".recipe-card");
  if (!card) return;
  await displayDetails(card.dataset.mealId);
});

const categoryStyle = {
  Beef: { color: "red", icon: "fa-drumstick-bite" },
  Chicken: { color: "amber", icon: "fa-drumstick-bite" },
  Dessert: { color: "pink", icon: "fa-cake-candles" },
  Lamb: { color: "orange", icon: "fa-drumstick-bite" },
  Miscellaneous: { color: "slate", icon: "fa-bowl-rice" },
  Pasta: { color: "yellow", icon: "fa-bowl-food" },
  Pork: { color: "rose", icon: "fa-bacon" },
  Seafood: { color: "sky", icon: "fa-fish" },
  Side: { color: "emerald", icon: "fa-bread-slice" },
  Starter: { color: "teal", icon: "fa-utensils" },
  Vegan: { color: "green", icon: "fa-leaf" },
  Vegetarian: { color: "lime", icon: "fa-seedling" },
  Breakfast: { color: "orange", icon: "fa-mug-hot" },
  Goat: { color: "stone", icon: "fa-drumstick-bite" },
};

async function displayDetails(id) {
  console.log(`Meals Details : ${id}`);
  var mealDetails = await MealsRepository.getMealDetails(id);
  var mealDetailsHerosContent = ` <img
                src="${mealDetails.thumbnail}"
                alt="${mealDetails.name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${mealDetails.category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${mealDetails.area}</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${mealDetails.name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">Calculating....</span>
                  </span>
                </div>
              </div>`;
  var ingredientsContent = "";
  var ingredientsCard = "";
  var instructionsContent = "";
  var instructionsCard = "";

  for (var i = 0; i < mealDetails.ingredients.length; i++) {
    var ingredientItem = mealDetails.ingredients[i];
    ingredientsContent += ` <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${ingredientItem.measure}</span> ${ingredientItem.ingredient}
                    </span>
                  </div>`;
  }
  if (mealDetails.ingredients.length > 0) {
    ingredientsCard = `<div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span id="ingredients-count" class="text-sm font-normal text-gray-500 ml-auto"
                    >9 items</span
                  >
                </h2>
                <div id="ingredients-grids" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                </div>
                ${ingredientsContent}
              </div>`;
  }

  for (var z = 0; z < mealDetails.instructions.length; z++) {
    var instructionItem = mealDetails.instructions[z];
    instructionsContent += `<div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      ${z + 1}
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                     ${instructionItem[z]}
                    </p>
                  </div>`;
  }

  if (mealDetails.instructions.length > 0) {
    instructionsCard = ` <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${instructionsContent}
                </div>
              </div>`;
  }

  console.log(mealDetails.youtube);
  var videoContent = `<div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src="${mealDetails.youtube}"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </div>`;

  document.getElementById("hero-section").innerHTML = mealDetailsHerosContent;

  var mainContent = "";

  mainContent += `
       <!-- Ingredients -->
       ${ingredientsCard}
   `;

  mainContent += `
       <!-- Instructions -->
       ${instructionsCard}
   `;

  mainContent += `
       <!-- Video Section -->
       ${videoContent}
   `;
  document.getElementById("main-content-grid").innerHTML = mainContent;
  showSection("details", true);
  const openBtn = document.getElementById("log-meal-btn");

  openBtn.classList.remove("bg-blue-600", "text-white");

  openBtn.innerHTML = `<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div> <span>Calculating....</span>
</div>`;

  var analyz = await MealsRepository.getNutritionAnalyze(
    mealDetails.name,
    mealDetails.ingredients.map((e) => e.ingredient)
  );

  openBtn.classList.remove(
    "bg-blue-600",
    "text-white",
    "hover:bg-blue-700",
    "transition-all"
  );
  openBtn.classList.add("bg-grey-600", "text-black");

  openBtn.innerHTML = `
  <span class="flex items-center justify-center gap-3">
    <span class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></span>
    <span>Calculating...</span>
  </span>
`;

  document.getElementById(
    "nutrition-facts-container"
  ).innerHTML = `<span class="flex items-center justify-center gap-3">
    <span class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></span>
    <span>Calculating...</span>
  </span>`;

  var totals = analyz.totals;
  var perServing = analyz.perServing;
  var calouries = document.getElementById("hero-calories");
  calouries.innerHTML = `${totals.calories} cal/serving`;

  document.getElementById(
    "nutrition-facts-container"
  ).innerHTML = `<p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${
                      perServing.calories
                    }</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${
                      totals.calories
                    } cal</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${
                        perServing.protein
                      }g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: ${
                          (perServing.protein / totals.protein) * 100
                        }%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${
                        perServing.carbs
                      }g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${
                          (perServing.carbs / totals.carbs) * 100
                        }%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${
                        perServing.fat
                      }g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: ${(perServing.fat / totals.fat) * 100}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${
                        perServing.fiber
                      }g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: ${
                          (perServing.fiber / totals.fiber) * 100
                        }%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${
                        perServing.sugar
                      }g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: ${
                          (perServing.sugar / totals.sugar) * 100
                        }%"
                      ></div>
                    </div>
                     <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">SaturatedFat</span>
                      </div>
                      <span class="font-bold text-gray-900">${
                        perServing.saturatedFat
                      }g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-red-500 h-2 rounded-full"
                        style="width: ${
                          (perServing.saturatedFat / totals.saturatedFat) * 100
                        }%"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Other
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${
                          perServing.cholesterol
                        }g</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${perServing.sodium}g</span>
                      </div>
                     
                    </div>
                  </div>`;

  openBtn.classList.add("bg-blue-600", "text-white", "px-6", "py-3");

  openBtn.innerHTML = `<i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>`;

  preparingONLogThisMealModelInMealDetails(analyz, mealDetails);
}

function preparingONLogThisMealModelInMealDetails(analyz, mealDetails) {
  const modal = document.getElementById("log-meal-modal");
  const openBtn = document.getElementById("log-meal-btn");

  openBtn.onclick = () => {
    modal.style.display = "flex";
    modalHeader.innerHTML = `<img
    src="${mealDetails.thumbnail}"
    alt="${mealDetails.name}"
  />
  <div>
    <h3>Log This Meal</h3>
    <p>${mealDetails.name}</p>
  </div>`;
    document.getElementById("modal-calories").innerHTML =
      analyz.perServing.calories;
    document.getElementById("modal-protein").innerHTML =
      analyz.perServing.protein;
    document.getElementById("modal-carbs").innerHTML = analyz.perServing.carbs;
    document.getElementById("modal-fat").innerHTML = analyz.perServing.fat;
  };

  const cancelBtn = document.getElementById("cancel-log-meal");
  const confirmBtn = document.getElementById("confirm-log-meal");
  const modalHeader = document.getElementById("modal-header");
  const input = document.getElementById("meal-servings");
  const increaseBtn = document.getElementById("increase-servings");
  const decreaseBtn = document.getElementById("decrease-servings");

  // Close when clicking outside
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  increaseBtn.onclick = () => {
    let value = parseFloat(input.value);
    let max = parseFloat(input.max);
    let step = parseFloat(input.step);

    if (value < max) {
      input.value = (value + step).toFixed(1);
    }
  };

  decreaseBtn.onclick = () => {
    let value = parseFloat(input.value);
    let min = parseFloat(input.min);
    let step = parseFloat(input.step);

    if (value > min) {
      input.value = (value - step).toFixed(1);
    }
  };

  cancelBtn.onclick = () => {
    modal.style.display = "none";
  };

  confirmBtn.onclick = () => {
    modal.style.display = "none";
    saveFoodLog(
      mealDetails.name,
      mealDetails.thumbnail,
      analyz.perServing,
      input.value
    );
  };
}

function saveFoodLog(name, image, perServing, count, isMeal = true) {
  var foodLogItem = {
    name: name,
    image: image,
    calories: perServing.calories,
    fat: perServing.fat,
    protein: perServing.protein,
    carbs: perServing.carbs,
    type: isMeal ? "Recipe" : "Product",
    count: count,
  };

  foodLogs.push(foodLogItem);
  localStorage.setItem("foodLogs", JSON.stringify(foodLogs));
  showSuccessDialog(name, count, perServing.calories);
}

function showSuccessDialog(mealName, servings, calories) {
  Swal.fire({
    icon: "success",
    title: "Meal Logged!",
    html: `
      <p style="font-size:16px; color:#4b5563; margin-bottom:10px;">
        <strong>${mealName}</strong> (${servings} serving) has been added to your daily log.
      </p>
      <p style="font-size:22px; font-weight:bold; color:#22c55e;">
        +${calories * servings} calories
      </p>
    `,
    confirmButtonText: "OK",
    confirmButtonColor: "#2563eb",
    width: 520,
  });
}

var btnSearch = document.getElementById("search-product-btn");
var btnLookUp = document.getElementById("lookup-barcode-btn");

btnSearch.onclick = async () => {
  document.getElementById(
    "products-grid"
  ).innerHTML = `<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>`;
  var productSearchInput = document.getElementById(
    "product-search-input"
  ).value;
  var productData = await ProductsRepository.getProductsBySearch(
    productSearchInput
  );
  console.log(productData);

  displayProduct(productData);
};

btnLookUp.onclick = async () => {
  document.getElementById(
    "products-grid"
  ).innerHTML = `<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>`;
  var productBarcodeInput = document.getElementById("barcode-input").value;
  var productData = await ProductsRepository.getProductsBarcode(
    productBarcodeInput
  );
  console.log(productData);
  displayProduct(productData, true);
};

function displayProduct(products, isFromBarcode = false) {
  let productsCard = "";
  if (isFromBarcode) {
    productsCard = `<div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                 data-index="${x}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${products.image}"
                    alt="${products.name}"
                    loading="lazy"
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${products.nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA 2"
                  >
                    ${products.novaGroup}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                  ${products.brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                  ${products.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>${products.nutrients.calories}g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>350 kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${products.nutrients.protein}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${products.nutrients.carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${products.nutrients.fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${products.nutrients.sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`;
  } else {
    for (var x = 0; x < products.length; x++) {
      console.log(products[x]);
      productsCard += `<div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                 data-index="${x}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${products[x].image}"
                    alt="${products[x].name}"
                    loading="lazy"
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${products[x].nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA 2"
                  >
                    ${products[x].novaGroup}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                  ${products[x].brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                  ${products[x].name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>${products[x].nutrients.calories}g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>350 kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${products[x].nutrients.protein}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${products[x].nutrients.carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${products[x].nutrients.fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${products[x].nutrients.sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>`;
    }
  }
  document.getElementById("products-grid").classList.remove("grid-cols-12");
  document.getElementById("products-grid").classList.add("grid-cols-3");
  document.getElementById("products-grid").innerHTML = productsCard;

  productModelCategory(products, isFromBarcode);
}

async function getProductCategories() {
  var categories = [];
  showLoading();
  try {
    categories = await ProductsRepository.getProductCategories();
  } catch (e) {
  } finally {
    hideLoading();
    displayProductCategories(categories);
  }
}

function displayProductCategories(categories) {
  var categoriesContent = "";
  categories.sort((a, b) => a.name.localeCompare(b.name));
  for (var x = 0; x < categories.length; x++) {
    categoriesContent += `<button
                data-category="${categories[x].name}"
                class="product-category-btn px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-emerald-200 transition-all"
              >
                  <i class="fa-solid fa-cookie mr-1.5"></i>${categories[x].name}
              </button>`;
  }
  document.getElementById("product-categories").innerHTML = categoriesContent;
  document.addEventListener("click", function (e) {
    if (e.target.closest(".product-category-btn")) {
      const category = e.target.closest(".product-category-btn").dataset
        .category;
      filterByCat(category);
    }
  });
}

async function filterByCat(category) {
  document.getElementById(
    "products-grid"
  ).innerHTML = `<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>`;

  var productsFiltered = [];
  try {
    productsFiltered = await ProductsRepository.filterProductByCategory(
      category
    );
  } catch (e) {
  } finally {
    displayProduct(productsFiltered);
  }
}

function productModelCategory(products, isFromBarcode = false) {
  const productModal = document.getElementById("product-modal");

  // Close when clicking outside
  productModal.onclick = (e) => {
    if (e.target === productModal) {
      productModal.style.display = "none";
    }
  };

  document.addEventListener("click", function (e) {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const index = card.dataset.index;

    const product = isFromBarcode ? products : products[index];

    openProductModal(product);
    productModal.style.display = "flex";
  });
}

function openProductModal(product) {
  const productModal = document.getElementById("product-modal");

  // image
  productModal.querySelector(".product-image img").src = product.image;
  productModal.querySelector(".product-image img").alt = product.name;

  // basic info
  productModal.querySelector(".brand").textContent = product.brand;
  productModal.querySelector("h2").textContent = product.name;

  // badges
  productModal.querySelector(".badge-circle.yellow").textContent =
    product.nutritionGrade.toUpperCase();
  productModal.querySelector(".badge-circle.red").textContent =
    product.novaGroup;

  // calories
  productModal.querySelector(".cal-value").textContent =
    product.nutrients.calories;

  // nutrition values
  productModal.querySelector(".green").textContent =
    product.nutrients.protein + "g";
  productModal.querySelector(".blue").textContent =
    product.nutrients.carbs + "g";
  productModal.querySelector(".purple").textContent =
    product.nutrients.fat + "g";
  productModal.querySelector(".orange").textContent =
    product.nutrients.sugar + "g";

  const logProductBtn = document.getElementById("log-product");
  logProductBtn.onclick = () => {
    productModal.style.display = "none";
    saveFoodLog(product.name, product.image, product.nutrients, 1, false);
  };
}

function displayFoodLog() {
  var foodLogsLocal = localStorage.getItem("foodLogs");
  foodLogs = JSON.parse(foodLogsLocal) ?? [];
  var emptyData = ` <div class="text-center py-8 text-gray-500">
                  <i
                    class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"
                  ></i>
                  <p class="font-medium">No meals logged today</p>
                  <p class="text-sm">
                    Add meals from the Meals page or scan products
                  </p>
                </div>`;
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalProtien = 0;

  var foodLogsContent = "";
  for (var i = 0; i < foodLogs.length; i++) {
    totalCalories += foodLogs[i].calories;
    totalCarbs += foodLogs[i].carbs;
    totalFat += foodLogs[i].fat;
    totalProtien += foodLogs[i].protein;

    foodLogsContent += `<div
                class="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <!-- Left -->
                <div class="flex items-center gap-4" >
                  <img
                    src="${foodLogs[i].image}"
                    alt="${foodLogs[i].name}"
                    class="h-14 w-14 rounded-xl object-cover"
                  />

                  <div>
                    <p class="font-semibold text-gray-900">Chicken Handi</p>

                    <p class="text-sm text-gray-500">
                      ${foodLogs[i].count} serving
                      <span class="mx-1">•</span>
                      <span class="text-emerald-600">${foodLogs[i].type}</span>
                    </p>

                    <p class="mt-1 text-xs text-gray-400">9:59 AM</p>
                  </div>
                </div>

                <!-- Right -->
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="text-lg font-bold text-emerald-600">2152</p>
                    <p class="text-xs text-gray-500">kcal</p>
                  </div>

                  <!-- Macros -->
                  <div class="hidden gap-2 text-xs text-gray-500 md:flex">
                    <span class="rounded bg-blue-50 px-2 py-1">${foodLogs[i].protein}g P</span>
                    <span class="rounded bg-amber-50 px-2 py-1">${foodLogs[i].carbs}g C</span>
                    <span class="rounded bg-purple-50 px-2 py-1">${foodLogs[i].fat}g F</span>
                  </div>

                  <!-- Delete -->
                  <button
                  id="delete-item-food-log"
                    class="rounded-lg p-2 text-gray-400 transition hover:text-red-500"
                    data-index="${i}"
                    
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>`;
  }

  if (foodLogs.length == 0) {
    document.getElementById("logged-items-list").innerHTML = emptyData;
    document.getElementById("clear-foodlog").style.display = "flex";
    document.getElementById(
      "progress-content"
    ).innerHTML = `  <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">0 / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">0/ 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">0 / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">0 / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>`;
  } else {
    document.getElementById("clear-foodlog").style.display = "flex";
    document.getElementById(
      "counter-logs"
    ).innerHTML = `Logged Items (${foodLogs.length})`;
    document.getElementById(
      "progress-content"
    ).innerHTML = `  <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${totalCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${(totalCalories / 2000) * 100}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${totalProtien} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${(totalProtien / 50) * 100}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${totalCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${(totalCarbs / 250) * 100}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${totalFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width: ${(totalFat / 65) * 100}%"
                  ></div>
                </div>
              </div>`;
    document.getElementById("logged-items-list").innerHTML = foodLogsContent;
    document.getElementById("delete-item-food-log").onclick = () => {
      const index = document.getElementById("delete-item-food-log").dataset
        .index;
      deleteFoodLog(index);
    };
  }
}

document.getElementById("clear-foodlog").onclick = () => {
  foodLogs = [];
  localStorage.clear();
  displayFoodLog();
};

function deleteFoodLog(index) {
  foodLogs.splice(index, 1);
  localStorage.setItem("foodLogs", JSON.stringify(foodLogs));
  displayFoodLog();
}
