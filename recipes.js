// get all recipe links
const recipeLinks = document.querySelectorAll('.recipe-link');

// loop through each link and add a click event listener
recipeLinks.forEach((link) => {
  link.addEventListener('click', function(event) {
    // prevent the link from navigating to a new page
    event.preventDefault();

    // get the filename of the recipe
    const href = this.getAttribute('href');
    const filename = href.split('/').pop().replace('.html', '.md');

    // fetch the markdown content for the recipe
    fetch(`../_recipes/${filename}`)
      .then(response => response.text())
      .then(data => {
        // parse the YAML front matter
        const [frontMatter, content] = data.split('---\n').slice(1);
        const recipeData = yaml.load(frontMatter);

        // parse the recipe content as HTML
        const converter = new showdown.Converter();
        const html = converter.makeHtml(content);

        // create a new modal with the recipe data and content
        const modal = createModal(recipeData, html);
        document.body.appendChild(modal);

        // add event listeners for the modal
        const closeButton = modal.querySelector('.modal-close');
        closeButton.addEventListener('click', function() {
          modal.remove();
        });

        const adjustServings = modal.querySelector('.adjust-servings');
        adjustServings.addEventListener('input', function() {
          const servingCount = parseInt(this.value);

          if (isNaN(servingCount)) {
            return;
          }

          const recipeIngredients = modal.querySelectorAll('.recipe-ingredient');
          recipeIngredients.forEach((ingredient) => {
            const originalAmount = ingredient.getAttribute('data-amount');
            const scaledAmount = originalAmount / recipeData.servings * servingCount;
            ingredient.querySelector('.ingredient-amount').textContent = scaledAmount.toFixed(1);
          });
        });
      });
  });
});

// function to create a modal element with the recipe data and content
function createModal(recipeData, recipeContent) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');
  modal.appendChild(modalOverlay);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeButton = document.createElement('button');
  closeButton.classList.add('modal-close');
  closeButton.textContent = '×';
  modalContent.appendChild(closeButton);

  const title = document.createElement('h2');
  title.textContent = recipeData.title;
  modalContent.appendChild(title);

  const creator = document.createElement('p');
  creator.textContent = `Created by ${recipeData.creator} on ${recipeData.date}`;
  modalContent.appendChild(creator);

  const servings = document.createElement('p');
  servings.textContent = `Servings: ${recipeData.servings}`;
  modalContent.appendChild(servings);

  const servingsAdjuster = document.createElement('div');
  servingsAdjuster.classList.add('servings-adjuster');
  const servingsAdjusterLabel = document.createElement('label');
  servingsAdjusterLabel.textContent = 'Adjust Servings: ';
  const servingsAdjusterInput = document.createElement('input');
  servingsAdjusterInput.classList.add('adjust-servings');
  servingsAdjusterInput.setAttribute('type', 'number');
  servingsAdjusterInput.setAttribute('min', 1);
  servingsAdjusterInput.setAttribute('value', recipeData.servings);
  servingsAdjuster.appendChild(servingsAdjusterLabel);
  servingsAdjuster.appendChild(servingsAdjusterInput);
  modalContent.appendChild(servingsAdjuster);

  const content = document.createElement('div');
  content.innerHTML
