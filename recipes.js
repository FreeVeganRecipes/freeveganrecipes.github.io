// Get all recipe links on the page
const recipeLinks = document.querySelectorAll('.recipe-link');

// Loop through each recipe link and add a click event listener
recipeLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    // Get the filename of the recipe markdown file
    const filename = link.getAttribute('href').replace('.html', '.md');
    // Create a modal element for the recipe
    createModal(filename);
  });
});

// Function to create a modal element for a recipe
function createModal(filename) {
  // Fetch the recipe data and content
  fetch(`./_recipes/${filename}`)
    .then(response => response.text())
    .then(recipeData => {
      // Split the recipe data into YAML front matter and content
      const [yamlData, recipeContent] = recipeData.split('---\n').slice(1);
      // Parse the YAML front matter
      const recipe = yaml.load(yamlData);
      // Parse the recipe content as HTML
      const converter = new showdown.Converter();
      const recipeHTML = converter.makeHtml(recipeContent);
      // Create a new modal element with the recipe data and content
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>${recipe.title}</h2>
          <p><strong>Creator:</strong> ${recipe.creator}</p>
          <p><strong>Date:</strong> ${recipe.date}</p>
          <div class="recipe-content">${recipeHTML}</div>
          <div class="recipe-servings">
            <label for="servings">Servings:</label>
            <input type="number" id="servings" name="servings" value="${recipe.servings}" min="1">
          </div>
        </div>
      `;
      // Add the modal to the DOM
      document.body.appendChild(modal);
      // Add event listeners to the modal
      const closeModal = modal.querySelector('.close-modal');
      closeModal.addEventListener('click', () => modal.remove());
      const adjustServings = modal.querySelector('#servings');
      adjustServings.addEventListener('input', () => adjustIngredientAmounts(recipeHTML, recipe.servings, adjustServings.value));
    });
}

// Function to adjust the ingredient amounts based on the number of servings
function adjustIngredientAmounts(recipeHTML, oldServings, newServings) {
  const recipeContent = document.querySelector('.recipe-content');
  // Get all ingredient amounts in the recipe
  const ingredientAmounts = recipeHTML.match(/\d+\s*(\/\s*\d+)?\s*(cup|cups|tbsp|tsp|ounces|pounds|g|kg)/gi);
  // Loop through each ingredient amount and adjust it based on the new number of servings
  ingredientAmounts.forEach(amount => {
    const oldAmount = amount.split(' ')[0];
    const unit = amount.split(' ')[1];
    const newAmount = parseFloat(((oldAmount / oldServings) * newServings).toFixed(2));
    recipeContent.innerHTML = recipeContent.innerHTML.replace(amount, `${newAmount} ${unit}`);
  });
}
