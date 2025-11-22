import recipes from "./recipes.mjs";

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

function getRandomListEntry(list) {
  const index = getRandomNumber(list.length);
  return list[index];
}

function tagsTemplate(tags) {
  if (!tags || tags.length === 0) return "";

  return tags
    .map((tag) => `<li class="recipe-tag">${tag.toLowerCase()}</li>`)
    .join("");
}

function ratingTemplate(rating) {
  const fullStars = Math.round(rating);
  let html = `
    <span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">
  `;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    } else {
      html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
    }
  }

  html += `</span>`;
  return html;
}

function recipeTemplate(recipe) {
  return `
    <figure class="recipe-card">
      <div class="recipe-image-wrap">
        <img src="${recipe.image}" alt="${recipe.name}" />
      </div>

      <div class="recipe-info">
        <ul class="recipe-tags">
          ${tagsTemplate(recipe.tags)}
        </ul>

        <h2 class="recipe-title">
          <span>${recipe.name}</span>
        </h2>

        <p class="recipe-rating">
          ${ratingTemplate(recipe.rating)}
        </p>

        <p class="recipe-description">
          ${recipe.description}
        </p>
      </div>
    </figure>
  `;
}

function renderRecipes(recipeList) {
  const output = document.querySelector("#recipes");
  if (!output) return;

  const html = recipeList.map((recipe) => recipeTemplate(recipe)).join("");
  output.innerHTML = html;
}

function filterRecipes(query) {
  const q = query.toLowerCase();

  const filtered = recipes.filter((recipe) => {
    const inName = recipe.name.toLowerCase().includes(q);
    const inDescription = recipe.description.toLowerCase().includes(q);

    const inTags =
      recipe.tags &&
      recipe.tags.find((tag) => tag.toLowerCase().includes(q));

    const inIngredients =
      recipe.recipeIngredient &&
      recipe.recipeIngredient.find((ing) =>
        ing.toLowerCase().includes(q)
      );

    return inName || inDescription || inTags || inIngredients;
  });

  filtered.sort((a, b) => a.name.localeCompare(b.name));

  return filtered;
}

function searchHandler(e) {
  e.preventDefault();

  const inputEl = document.querySelector("#search-input");
  const query = inputEl.value.toLowerCase();

  const results = filterRecipes(query);
  renderRecipes(results);
}

function init() {
  const randomRecipe = getRandomListEntry(recipes);
  renderRecipes([randomRecipe]);

  const form = document.querySelector("#search-form");
  form.addEventListener("submit", searchHandler);
}

init();