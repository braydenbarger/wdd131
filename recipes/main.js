import recipes from "./recipes.mjs";

const imgEl = document.querySelector("#recipe-image");
const titleEl = document.querySelector("#recipe-title");
const tagEl = document.querySelector("#recipe-tag");
const ratingEl = document.querySelector("#recipe-rating");
const descriptionEl = document.querySelector("#recipe-description");
const noResultsEl = document.querySelector("#no-results");

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

function buildRatingStars(value) {
  const maxStars = 5;
  const fullStars = Math.round(value);

  const wrapper = document.createElement("span");
  wrapper.classList.add("rating");
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", `Rating: ${value} out of 5 stars`);

  for (let i = 1; i <= maxStars; i++) {
    const star = document.createElement("span");
    star.setAttribute("aria-hidden", "true");
    star.textContent = i <= fullStars ? "★" : "☆";
    wrapper.appendChild(star);
  }

  return wrapper;
}

function renderRecipe(recipe) {
  if (!recipe) return;

  noResultsEl.hidden = true;

  imgEl.src = recipe.image;
  imgEl.alt = recipe.name || "Recipe image";

  titleEl.textContent = recipe.name || "";

  if (Array.isArray(recipe.tags) && recipe.tags.length > 0) {
    tagEl.textContent = recipe.tags[0].toLowerCase();
  } else {
    tagEl.textContent = "";
  }

  ratingEl.innerHTML = "";
  if (typeof recipe.rating === "number") {
    ratingEl.appendChild(buildRatingStars(recipe.rating));
  }

  descriptionEl.textContent = recipe.description || "";
}

function findRecipe(query) {
  const term = query.trim().toLowerCase();
  if (!term) {
    return recipes[recipes.length - 1];
  }

  return (
    recipes.find((r) => {
      const inName = r.name?.toLowerCase().includes(term);
      const inTags =
        Array.isArray(r.tags) &&
        r.tags.some((t) => t.toLowerCase().includes(term));
      const inIngredients =
        Array.isArray(r.recipeIngredient) &&
        r.recipeIngredient.some((i) => i.toLowerCase().includes(term));
      return inName || inTags || inIngredients;
    }) || null
  );
}

function handleSearch(evt) {
  evt.preventDefault();
  const recipe = findRecipe(searchInput.value);
  if (!recipe) {
    noResultsEl.hidden = false;
    return;
  }
  renderRecipe(recipe);
}

renderRecipe(recipes[recipes.length - 1]);

if (searchForm) {
  searchForm.addEventListener("submit", handleSearch);
}
