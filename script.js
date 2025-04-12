let extensionsData = [];

async function loadExtensions() {
  try {
    const response = await fetch("data.json");
    const extensions = await response.json();
    return extensions;
  } catch (error) {
    console.error("Erro ao carregar extensões:", error);
    return [];
  }
}

function createExtensionCard(extension) {
  const card = document.createElement("div");
  card.className = `extension-card ${
    extension.isActive ? "active" : "inactive"
  }`;
  card.dataset.id = extension.id;
  card.dataset.isActive = extension.isActive;

  card.innerHTML = `
        <img src="${extension.logo}" alt="${
    extension.name
  } logo" class="extension-logo">
        <h2>${extension.name}</h2>
        <p>${extension.description}</p>
        <div class="extension-status">
            <span class="status-indicator ${
              extension.isActive ? "active" : "inactive"
            }"></span>
        </div>
        <div class="card-controls">
            <button class="remove-btn">Remove</button>
            <label class="toggle-switch ${extension.isActive ? "active" : ""}">
                <span class="slider"></span>
            </label>
        </div>
    `;

  const removeBtn = card.querySelector(".remove-btn");
  const toggleSwitch = card.querySelector(".toggle-switch");

  removeBtn.addEventListener("click", () => {
    removeExtension(card);
  });

  toggleSwitch.addEventListener("click", (e) => {
    e.preventDefault();
    const isActive = card.classList.contains("active");
    toggleExtensionStatus(card, !isActive);
  });

  return card;
}

function removeExtension(card) {
  if (confirm("Tem certeza que deseja remover esta extensão?")) {
    card.remove();
  }
}

function toggleExtensionStatus(card, isActive) {
  const statusIndicator = card.querySelector(".status-indicator");
  const toggleSwitch = card.querySelector(".toggle-switch");

  if (isActive) {
    card.classList.remove("inactive");
    card.classList.add("active");
    statusIndicator.classList.remove("inactive");
    statusIndicator.classList.add("active");
    toggleSwitch.classList.add("active");
    card.dataset.isActive = "true";
  } else {
    card.classList.remove("active");
    card.classList.add("inactive");
    statusIndicator.classList.remove("active");
    statusIndicator.classList.add("inactive");
    toggleSwitch.classList.remove("active");
    card.dataset.isActive = "false";
  }
}

function renderExtensions(extensions, filter = "all") {
  const grid = document.querySelector(".extensions-grid");
  grid.innerHTML = "";

  const filteredExtensions = extensions.filter((extension) => {
    if (filter === "all") return true;
    if (filter === "active") return extension.isActive;
    if (filter === "inactive") return !extension.isActive;
  });

  filteredExtensions.forEach((extension) => {
    const card = createExtensionCard(extension);
    grid.appendChild(card);
  });
}

function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-buttons-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
      });
      button.setAttribute("aria-pressed", "true");
      const filter = button.textContent.toLowerCase().trim();
      const cards = document.querySelectorAll(".extension-card");
      cards.forEach((card) => {
        const isActive = card.dataset.isActive === "true";
        if (filter === "all") {
          card.style.display = "";
        } else if (filter === "active" && !isActive) {
          card.style.display = "none";
        } else if (filter === "inactive" && isActive) {
          card.style.display = "none";
        } else {
          card.style.display = "";
        }
      });
    });
  });
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  const modeIcon = document.querySelector(".mode-icon");
  const isDarkMode = document.body.classList.contains("dark-mode");

  modeIcon.src = isDarkMode
    ? "./assets/images/icon-sun.svg"
    : "./assets/images/icon-moon.svg";
}

document.addEventListener("DOMContentLoaded", () => {
  loadExtensions().then((extensions) => {
    renderExtensions(extensions);
  });

  initializeFilters();
});
