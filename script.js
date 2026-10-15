/* ==========================================================================
   ToolifyHub — Site behavior
   Mobile navigation, live tool search, sticky header state, and a
   single-open FAQ accordion.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScrollState();
  initToolSearch();
  initFaqAccordion();
});

/* ---------- Mobile navigation ---------- */

function initMobileNav() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.querySelector(".nav-links");

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  // Close the menu after a nav link is tapped.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    });
  });

  // Close the menu if the viewport grows back to desktop size.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && navLinks.classList.contains("is-open")) {
      navLinks.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }
  });
}

/* ---------- Header shadow on scroll ---------- */

function initHeaderScrollState() {
  const header = document.querySelector(".header");
  if (!header) return;

  const updateState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateState();
  window.addEventListener("scroll", updateState, { passive: true });
}

/* ---------- Live tool search ---------- */

function initToolSearch() {
  const input = document.getElementById("toolSearch");
  const searchButton = document.querySelector(".hero-search button");
  const toolCards = document.querySelectorAll(".tool-card");
  const toolsGrid = document.querySelector(".tools-grid");

  if (!input || !toolCards.length) return;

  let noResultsEl = null;

  const showNoResultsMessage = (query) => {
    if (!toolsGrid) return;
    if (!noResultsEl) {
      noResultsEl = document.createElement("p");
      noResultsEl.className = "no-results";
      toolsGrid.appendChild(noResultsEl);
    }
    noResultsEl.textContent = `No tools found for "${query}". Try a different search.`;
    noResultsEl.style.display = "block";
  };

  const hideNoResultsMessage = () => {
    if (noResultsEl) {
      noResultsEl.style.display = "none";
    }
  };

  const filterTools = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    toolCards.forEach((card) => {
      const name = (card.dataset.name || card.textContent || "").toLowerCase();
      const matches = query === "" || name.includes(query);
      card.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });

    if (query !== "" && visibleCount === 0) {
      showNoResultsMessage(input.value.trim());
    } else {
      hideNoResultsMessage();
    }
  };

  input.addEventListener("input", filterTools);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      scrollToTools();
      filterTools();
    }
  });

  if (searchButton) {
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToTools();
      filterTools();
    });
  }
}

function scrollToTools() {
  const toolsSection = document.getElementById("tools");
  if (toolsSection) {
    toolsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- FAQ accordion (only one entry open at a time) ---------- */

function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-list details");
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}