// ========================
// GLOBAL STATE
// ========================
let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

// ========================
// DOM ELEMENTS
// ========================
const grid = document.querySelector(".card-grid");
const searchInput = document.getElementById("searchInput");
const raritySelect = document.getElementById("raritySelect");
const paginationItems = document.querySelectorAll(".page-item");

// ========================
// TÜRE GÖRE KART RENKLERİ
// ========================
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

// ========================
// 1–151 TÜM POKÉMON’U ÇEK
// ========================
async function fetchPokemon() {
  for (let id = 1; id <= 151; id++) {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let data = await res.json();

    allPokemon.push({
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      type: data.types[0].type.name,
      rarity: generateRarity(), // rastgele rarity
      power: data.types[0].type.name,
    });
  }

  filteredPokemon = [...allPokemon];
  renderPage();
}

// ========================
// RARITY OLUŞTURUCU
// ========================
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

// ========================
// KART ÇİZİMİ
// ========================
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

// ========================
// SAYFALAMA
// ========================
function renderPage() {
  let start = (currentPage - 1) * ITEMS_PER_PAGE;
  let end = start + ITEMS_PER_PAGE;

  let currentList = filteredPokemon.slice(start, end);
  renderCards(currentList);

  updatePaginationUI();
}

function updatePaginationUI() {
  paginationItems.forEach((item, index) => {
    if (index + 1 === currentPage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// ========================
// ARAMA + FİLTRE
// ========================
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

// ========================
// EVENT LISTENERS
// ========================
searchInput.addEventListener("input", applyFilters);
raritySelect.addEventListener("change", applyFilters);

paginationItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    currentPage = index + 1;
    renderPage();
  });
});

// ========================
// BAŞLAT
// ========================
fetchPokemon();
