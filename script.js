const ration = [
  {
    meal: "Breakfast",
    menu: "Oatmeal, 2 eggs, banana, yogurt",
    protein: "32 g"
  },
  {
    meal: "Lunch",
    menu: "Chicken breast, rice, vegetable salad",
    protein: "45 g"
  },
  {
    meal: "Supper",
    menu: "Salmon, potatoes, cottage cheese",
    protein: "42 g"
  }
];

const gymProgram = [
  "Squat — 4x6",
  "Deadlift — 3x5",
  "Bench Press — 4x6",
  "Overhead Press — 3x8",
  "Pull-Ups — 4x max",
  "Barbell Row — 4x8"
];

const intake = [
  { label: "Protein", value: "120 g" },
  { label: "Carbs", value: "260 g" },
  { label: "Fats", value: "70 g" },
  { label: "Fiber", value: "30 g" },
  { label: "Water", value: "2.7 L" },
  { label: "Calories", value: "2350 kcal" }
];

const rationTable = document.getElementById("ration-table");
ration.forEach(({ meal, menu, protein }) => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${meal}</td><td>${menu}</td><td>${protein}</td>`;
  rationTable.appendChild(row);
});

const gymList = document.getElementById("gym-list");
gymProgram.forEach((exercise) => {
  const item = document.createElement("li");
  item.textContent = exercise;
  gymList.appendChild(item);
});

const intakeGrid = document.getElementById("intake-grid");
intake.forEach(({ label, value }) => {
  const item = document.createElement("article");
  item.className = "intake-item";
  item.innerHTML = `<p class="label">${label}</p><p class="value">${value}</p>`;
  intakeGrid.appendChild(item);
});

const monthLabel = document.getElementById("calendar-month");
const calendarGrid = document.getElementById("calendar-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date();
let current = new Date(today.getFullYear(), today.getMonth(), 1);

function renderCalendar(date) {
  calendarGrid.innerHTML = "";

  dayNames.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "day-name";
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthLabel.textContent = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDayOffset = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < firstDayOffset; i += 1) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    dayCell.textContent = String(day);

    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      dayCell.classList.add("today");
    }

    calendarGrid.appendChild(dayCell);
  }
}

prevMonthButton.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  renderCalendar(current);
});

nextMonthButton.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  renderCalendar(current);
});

renderCalendar(current);

const recipesGrid = document.getElementById("recipes-grid");
const recipesStatus = document.getElementById("recipes-status");
const searchInput = document.getElementById("search-input");
const mealFilter = document.getElementById("meal-filter");
const calorieFilter = document.getElementById("calorie-filter");
const proteinFilter = document.getElementById("protein-filter");
const fiberFilter = document.getElementById("fiber-filter");
const sortSelect = document.getElementById("sort-select");

let allRecipes = [];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseCsv(text) {
  const rows = [];
  let currentField = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      if (currentField || currentRow.length) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentField = "";
        currentRow = [];
      }
      continue;
    }

    currentField += char;
  }

  if (currentField || currentRow.length) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

function toRecipes(csvText) {
  const [headers, ...rows] = parseCsv(csvText);
  if (!headers) {
    return [];
  }

  return rows
    .filter((row) => row.length >= 8)
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] ? row[index].trim() : "";
      });

      return {
        name: item.Recipe_Name,
        mealType: item.Meal_Type,
        calories: Number(item.Calories),
        protein: Number(item.Protein_g),
        fiber: Number(item.Fiber_g),
        carbs: Number(item.Carbs_g),
        fat: Number(item.Fat_g),
        instructions: item.Instructions || ""
      };
    });
}

function isInCalorieRange(calories, range) {
  if (range === "200-300") {
    return calories >= 200 && calories <= 300;
  }
  if (range === "300-400") {
    return calories >= 300 && calories <= 400;
  }
  if (range === "400+") {
    return calories > 400;
  }
  return true;
}

function isInProteinRange(protein, range) {
  if (range === "high") {
    return protein >= 25;
  }
  if (range === "medium") {
    return protein >= 15 && protein < 25;
  }
  if (range === "low") {
    return protein < 15;
  }
  return true;
}

function isInFiberRange(fiber, range) {
  if (range === "high") {
    return fiber >= 10;
  }
  if (range === "medium") {
    return fiber >= 6 && fiber < 10;
  }
  if (range === "low") {
    return fiber < 6;
  }
  return true;
}

function recipeMatches(recipe, query) {
  if (!query) {
    return true;
  }
  const haystack = `${recipe.name} ${recipe.instructions}`.toLowerCase();
  return haystack.includes(query);
}

function sortRecipes(recipes, sortValue) {
  const sorted = [...recipes];
  const sorter = {
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "name-desc": (a, b) => b.name.localeCompare(a.name),
    "calories-asc": (a, b) => a.calories - b.calories,
    "calories-desc": (a, b) => b.calories - a.calories,
    "protein-asc": (a, b) => a.protein - b.protein,
    "protein-desc": (a, b) => b.protein - a.protein,
    "fiber-asc": (a, b) => a.fiber - b.fiber,
    "fiber-desc": (a, b) => b.fiber - a.fiber
  };
  sorted.sort(sorter[sortValue] || sorter["name-asc"]);
  return sorted;
}

function renderRecipes(recipes) {
  recipesGrid.innerHTML = recipes
    .map(
      (recipe) => `
      <article class="recipe-card">
        <div class="recipe-header">
          <h3>${escapeHtml(recipe.name)}</h3>
          <span class="recipe-meal">${escapeHtml(recipe.mealType)}</span>
        </div>
        <div class="recipe-metrics">
          <span><strong>${recipe.calories}</strong> kcal</span>
          <span><strong>${recipe.protein}g</strong> protein</span>
          <span><strong>${recipe.fiber}g</strong> fiber</span>
          <span><strong>${recipe.carbs}g</strong> carbs</span>
          <span><strong>${recipe.fat}g</strong> fat</span>
        </div>
        <details class="recipe-details">
          <summary>Cooking instructions</summary>
          <p>${escapeHtml(recipe.instructions)}</p>
        </details>
      </article>
    `
    )
    .join("");
}

function updateActiveFilterStyles() {
  const controls = [
    searchInput,
    mealFilter,
    calorieFilter,
    proteinFilter,
    fiberFilter,
    sortSelect
  ];

  controls.forEach((control) => {
    const isActive =
      control === sortSelect
        ? control.value !== "name-asc"
        : control.value && control.value !== "all";
    control.classList.toggle("active-filter", isActive);
  });
}

function applyRecipeFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const meal = mealFilter.value;
  const calories = calorieFilter.value;
  const protein = proteinFilter.value;
  const fiber = fiberFilter.value;
  const sort = sortSelect.value;

  const filtered = allRecipes.filter((recipe) => {
    if (meal !== "all" && recipe.mealType !== meal) {
      return false;
    }
    if (!isInCalorieRange(recipe.calories, calories)) {
      return false;
    }
    if (!isInProteinRange(recipe.protein, protein)) {
      return false;
    }
    if (!isInFiberRange(recipe.fiber, fiber)) {
      return false;
    }
    if (!recipeMatches(recipe, query)) {
      return false;
    }
    return true;
  });

  const sorted = sortRecipes(filtered, sort);
  renderRecipes(sorted);

  recipesStatus.textContent = sorted.length
    ? `Showing ${sorted.length} of ${allRecipes.length} recipes`
    : "No recipes found. Try adjusting filters or search.";

  updateActiveFilterStyles();
}

async function loadRecipes() {
  recipesStatus.textContent = "Loading recipes...";
  recipesGrid.innerHTML = "";

  try {
    const response = await fetch("./healthy-recipes.csv");
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const csvText = await response.text();
    allRecipes = toRecipes(csvText);

    if (!allRecipes.length) {
      recipesStatus.textContent = "No recipe data available.";
      return;
    }

    applyRecipeFilters();
  } catch (error) {
    recipesStatus.textContent =
      "Could not load recipes right now. Please refresh and try again.";
    recipesGrid.innerHTML = "";
    console.error("Recipe loading error:", error);
  }
}

[searchInput, mealFilter, calorieFilter, proteinFilter, fiberFilter, sortSelect].forEach(
  (control) => {
    control.addEventListener("input", applyRecipeFilters);
    control.addEventListener("change", applyRecipeFilters);
  }
);

loadRecipes();
