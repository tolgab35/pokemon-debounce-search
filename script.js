// Global state
let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

// DOM elements
const grid = document.querySelector(".card-grid");
const searchInput = document.getElementById("searchInput");
const raritySelect = document.getElementById("raritySelect");

// Type colors
const typeColors = {
  fire: "red",
  water: "blue",
  grass: "green",
  electric: "yellow",
  psychic: "purple",
  bug: "green",
  normal: "orange",
  fairy: "purple",
  fighting: "red",
  ground: "orange",
  rock: "orange",
  ghost: "purple",
  dragon: "blue",
  ice: "blue",
  poison: "purple",
};

// Fetch all Pokemon (1-151)
async function fetchPokemon() {
  for (let id = 1; id <= 151; id++) {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let data = await res.json();

    allPokemon.push({
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      type: data.types[0].type.name,
      rarity: generateRarity(),
      power: data.types[0].type.name,
    });
  }

  filteredPokemon = [...allPokemon];
  renderPage();
}

// Generate random rarity
function generateRarity() {
  const rarities = ["common", "rare", "epic", "legendary", "mythical"];
  const weights = [70, 15, 10, 4, 1];

  let rand = Math.random() * 100;
  let sum = 0;

  for (let i = 0; i < rarities.length; i++) {
    sum += weights[i];
    if (rand < sum) return rarities[i];
  }
  return "common";
}

// Render cards
function renderCards(list) {
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1; text-align:center;">No Pokémon found.</p>`;
    return;
  }

  list.forEach((p) => {
    let color = typeColors[p.type] || "orange";

    grid.innerHTML += `
      <div class="card" data-color="${color}">
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <p><strong>Name:</strong> ${p.name}</p>
          <p><strong>Rarity:</strong> ${p.rarity}</p>
          <p><strong>Card No:</strong> ${p.id}</p>
          <p><strong>Power:</strong> ${p.power}</p>
        </div>
      </div>
    `;
  });
}

// Pagination
function renderPage() {
  let start = (currentPage - 1) * ITEMS_PER_PAGE;
  let end = start + ITEMS_PER_PAGE;

  let currentList = filteredPokemon.slice(start, end);
  renderCards(currentList);

  updatePaginationUI();
}

function updatePaginationUI() {
  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const paginationContainer = document.querySelector(".pagination");

  paginationContainer.innerHTML = "";

  const pagesToShow = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pagesToShow.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pagesToShow.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pagesToShow.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }

  pagesToShow.forEach((item) => {
    if (item === "...") {
      const dots = document.createElement("span");
      dots.className = "pagination-dots";
      dots.textContent = "...";
      dots.style.display = "flex";
      dots.style.alignItems = "center";
      dots.style.color = "#666";
      dots.style.fontSize = "1.5rem";
      dots.style.padding = "0 10px";
      paginationContainer.appendChild(dots);
    } else {
      const pageItem = document.createElement("div");
      pageItem.className = "page-item";
      if (item === currentPage) {
        pageItem.classList.add("active");
      }

      pageItem.innerHTML = `
        <img src="assets/images/pokeball.png" alt="pokeball" />
        <span>${item}</span>
      `;

      pageItem.addEventListener("click", () => {
        currentPage = item;
        renderPage();
      });

      paginationContainer.appendChild(pageItem);
    }
  });
}

// Apply filters
function applyFilters() {
  const idVal = Number(searchInput.value);
  const rarityVal = raritySelect.value;

  filteredPokemon = allPokemon.filter((p) => {
    let condId = idVal ? p.id === idVal : true;
    let condRarity = rarityVal ? p.rarity === rarityVal : true;
    return condId && condRarity;
  });

  currentPage = 1;
  renderPage();
}

// Event listeners
searchInput.addEventListener("input", applyFilters);
raritySelect.addEventListener("change", applyFilters);

// Initialize
fetchPokemon();
