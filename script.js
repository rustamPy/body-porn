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
