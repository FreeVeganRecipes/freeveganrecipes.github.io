const recipesDiv = document.getElementById("recipes");

fetch("_recipes/recipes.json")
  .then(response => response.json())
  .then(recipes => {
    recipes.forEach(recipe => {
      const recipeLink = document.createElement("a");
      recipeLink.href = `_recipes/${recipe.url.replace(".md", ".html")}`;
      recipeLink.className = "markdown-body";
      recipeLink.textContent = recipe.title;
      recipesDiv.appendChild(recipeLink);

      const recipeDetails = document.createElement("p");
      recipeDetails.textContent = `Created by ${recipe.author} on ${recipe.date}. Difficulty: ${recipe.difficulty}`;
      recipesDiv.appendChild(recipeDetails);
    })
  });
