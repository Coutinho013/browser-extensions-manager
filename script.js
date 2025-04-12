let extensionsData = [];

async function loadExtensions() {
  try {
    const response = await fetch("data.json");
    extensionsData = await response.json();
    return extensionsData;
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
            <label class="toggle-switch">
                <input type="checkbox" ${extension.isActive ? "checked" : ""}>
                <span class="slider"></span>
            </label>
        </div>
    `;
  const removeBtn = card.querySelector(".remove-btn");
  const toggleInput = card.querySelector(".toggle-switch input");
  removeBtn.addEventListener("click", () => {
    removeExtension(card);
  });
  toggleInput.addEventListener("change", () => {
    toggleExtensionStatus(card, toggleInput.checked);
  });
  return card;
}

function removeExtension(card) {
  if (confirm("Tem certeza que deseja remover esta extensão?")) {
    const cardId = card.dataset.id;
    extensionsData = extensionsData.filter((ext) => ext.id !== cardId);
    card.remove();
    const activeFilter = document.querySelector(
      '.filter-buttons-button[aria-pressed="true"]'
    );
    const filter = activeFilter
      ? activeFilter.textContent.toLowerCase().trim()
      : "all";
    renderExtensions(extensionsData, filter);
  }
}

function toggleExtensionStatus(card, isActive) {
  const cardId = card.dataset.id;
  const extension = extensionsData.find((ext) => ext.id === cardId);
  if (extension) {
    extension.isActive = isActive;
    const statusIndicator = card.querySelector(".status-indicator");
    if (isActive) {
      card.classList.remove("inactive");
      card.classList.add("active");
      statusIndicator.classList.remove("inactive");
      statusIndicator.classList.add("active");
    } else {
      card.classList.remove("active");
      card.classList.add("inactive");
      statusIndicator.classList.remove("active");
      statusIndicator.classList.add("inactive");
    }
    const activeFilter = document.querySelector(
      '.filter-buttons-button[aria-pressed="true"]'
    );
    const filter = activeFilter
      ? activeFilter.textContent.toLowerCase().trim()
      : "all";
    renderExtensions(extensionsData, filter);
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
  if (filteredExtensions.length === 0) {
    grid.innerHTML =
      '<p class="no-extensions">Nenhuma extensão encontrada.</p>';
    return;
  }
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
      renderExtensions(extensionsData, filter);
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
