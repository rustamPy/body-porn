const today = new Date();

const intake = [
  { label: "Protein", value: "120 g" },
  { label: "Carbs", value: "260 g" },
  { label: "Fats", value: "70 g" },
  { label: "Fiber", value: "30 g" },
  { label: "Water", value: "2.7 L" },
  { label: "Calories", value: "2350 kcal" }
];

// Dynamic Ration - will initialize after helper functions are defined
let allRecipesForRation = [];
const rationTable = document.getElementById("ration-table");
const refreshRationButton = document.getElementById("refresh-ration");

const gymProgram = {
  "Monday - Chest & Triceps": [
    "Bench Press — 4x6",
    "Incline Dumbbell Press — 4x8",
    "Cable Flyes — 3x10",
    "Tricep Dips — 4x8",
    "Tricep Rope Pushdown — 3x10"
  ],
  "Tuesday - Back & Biceps": [
    "Deadlift — 3x5",
    "Barbell Row — 4x6",
    "Pull-Ups — 4x max",
    "Barbell Curl — 3x8",
    "Face Pulls — 3x12"
  ],
  "Wednesday - Legs": [
    "Squat — 4x6",
    "Romanian Deadlift — 3x8",
    "Leg Press — 3x10",
    "Leg Curl — 3x10",
    "Calf Raises — 4x12"
  ],
  "Thursday - Shoulders & Accessories": [
    "Overhead Press — 4x6",
    "Lateral Raise — 3x10",
    "Reverse Pec Deck — 3x12",
    "Shrugs — 3x8",
    "Plank — 3x60s"
  ],
  "Friday - Full Body": [
    "Barbell Squat — 3x5",
    "Bench Press — 3x6",
    "Barbell Row — 3x6",
    "Overhead Press — 3x8",
    "Dumbbell Rows — 3x8"
  ]
};

const gymDayMap = {
  1: "Monday - Chest & Triceps",
  2: "Tuesday - Back & Biceps",
  3: "Wednesday - Legs",
  4: "Thursday - Shoulders & Accessories",
  5: "Friday - Full Body"
};

const gymContainer = document.getElementById("gym-container");
const todayDow = today.getDay(); // 0=Sun, 1=Mon … 6=Sat
const todayGymDay = gymDayMap[todayDow];

if (!todayGymDay) {
  const rest = document.createElement("p");
  rest.className = "gym-rest";
  rest.textContent = "Rest day — recover and recharge! 🛌";
  gymContainer.appendChild(rest);
} else {
  const dayLabel = document.createElement("p");
  dayLabel.className = "gym-day-label";
  dayLabel.textContent = todayGymDay;
  gymContainer.appendChild(dayLabel);

  const list = document.createElement("ul");
  list.className = "gym-list";
  gymProgram[todayGymDay].forEach((exercise) => {
    const item = document.createElement("li");
    item.textContent = exercise;
    list.appendChild(item);
  });
  gymContainer.appendChild(list);
}

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
const goalProgress = document.getElementById("goal-progress");
const goalProgressFill = document.getElementById("goal-progress-fill");

const recipeControls = [
  searchInput,
  mealFilter,
  calorieFilter,
  proteinFilter,
  fiberFilter,
  sortSelect
];

let allRecipes = [];

function updateGoalProgress() {
  if (!goalProgress || !goalProgressFill) {
    return;
  }

  const startWeight = Number(goalProgress.dataset.startWeight);
  const currentWeight = Number(goalProgress.dataset.currentWeight);
  const goalWeight = Number(goalProgress.dataset.goalWeight);
  const totalToLose = startWeight - goalWeight;
  const lostSoFar = startWeight - currentWeight;
  const rawPercent = totalToLose > 0 ? (lostSoFar / totalToLose) * 100 : 0;
  const progressPercent = Math.max(0, Math.min(100, rawPercent));

  goalProgress.setAttribute("aria-valuenow", String(Math.round(progressPercent)));
  goalProgressFill.style.width = `${progressPercent}%`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");
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

// Dynamic Ration Functions
function getRandomRecipeByMealType(mealType) {
  const filtered = allRecipesForRation.filter(r => r.mealType === mealType);
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function renderRation() {
  rationTable.innerHTML = "";

  const mealMapping = {
    "Breakfast": "Breakfast",
    "Lunch": "Lunch",
    "Dinner": "Supper"
  };

  Object.entries(mealMapping).forEach(([recipeType, displayName]) => {
    const recipe = getRandomRecipeByMealType(recipeType);
    if (!recipe) return;

    const card = document.createElement("div");
    card.className = "ration-card";
    card.innerHTML = `
      <span class="ration-meal-tag">${displayName}</span>
      <p class="ration-name">${escapeHtml(recipe.name)}</p>
      <div class="ration-meta">
        <span>${recipe.protein.toFixed(0)} g protein</span>
        <span>${recipe.calories} kcal</span>
      </div>
    `;
    rationTable.appendChild(card);
  });
}

async function loadRationRecipes() {
  try {
    const response = await fetch("./healthy-recipes-ru.csv");
    if (!response.ok) throw new Error("Failed to load recipes for ration");

    const csvText = await response.text();
    allRecipesForRation = toRecipes(csvText);

    renderRation();
  } catch (error) {
    console.error("Error loading ration recipes:", error);
    rationTable.innerHTML = "<p style='color:#6b7280;font-style:italic'>Unable to load daily ration</p>";
  }
}

refreshRationButton.addEventListener("click", renderRation);

function isInCalorieRange(calories, range) {
  if (range === "under-200") {
    return calories < 200;
  }
  if (range === "200-300") {
    return calories >= 200 && calories <= 300;
  }
  if (range === "300-400") {
    return calories >= 300 && calories <= 400;
  }
  if (range === "400+") {
    return calories >= 400;
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
  recipeControls.forEach((control) => {
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
    const response = await fetch("./healthy-recipes-ru.csv");
    if (!response.ok) {
      throw new Error(
        `Request failed with ${response.status}: ${response.statusText}`
      );
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

recipeControls.forEach((control) => {
  control.addEventListener("input", applyRecipeFilters);
  control.addEventListener("change", applyRecipeFilters);
});

updateGoalProgress();
loadRecipes();
loadRationRecipes();
