// get all recipe links on the page
const recipeLinks = document.querySelectorAll('.recipe-link');

// loop through each recipe link and fetch its markdown content
recipeLinks.forEach(link => {
  fetch(link.href)
    .then(response => response.text())
    .then(text => {
      // convert the markdown to HTML and insert it into the page
      const converter = new showdown.Converter();
      const html = converter.makeHtml(text);
      link.insertAdjacentHTML('afterend', html);

      // add event listener to quantity input for each recipe
      const quantityInput = document.querySelector(`#${link.dataset.recipe}-quantity-input`);
      if (quantityInput) {
        quantityInput.addEventListener('input', () => {
          // get the ingredient list and loop through each ingredient
          const ingredientList = document.querySelector(`#${link.dataset.recipe}-ingredients-list`);
          const ingredients = ingredientList.querySelectorAll('li');
          ingredients.forEach(ingredient => {
            // get the quantity and unit from the ingredient
            const ingredientText = ingredient.textContent.trim();
            const quantityMatch = ingredientText.match(/^\d+\/?\d*|^\d*\.\d+|^\d+/);
            const quantity = quantityMatch ? parseFloat(quantityMatch[0]) : null;
            const unitMatch = ingredientText.match(/(?<=\d\s*)\w+|\w+$/);
            const unit = unitMatch ? unitMatch[0] : '';

            // calculate the new quantity based on the input value
            const newQuantity = quantityInput.value * quantity;

            // update the ingredient text with the new quantity and unit
            const newIngredientText = `${newQuantity.toFixed(1)} ${unit} ${ingredientText.substring(quantityMatch[0].length + unit.length + 1)}`;
            ingredient.textContent = newIngredientText;
          });
        });
      }
    });
});
