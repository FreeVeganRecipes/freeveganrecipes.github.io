// Define the path to the _recipes directory
var recipesPath = "_recipes/";

// Fetch the list of recipe files
fetch(recipesPath)
  .then(response => response.text())
  .then(data => {
    // Split the data into an array of filenames
    var filenames = data.trim().split("\n");

    // Loop through each filename and generate a link to the recipe
    var recipeList = document.getElementById("recipes");
    for (var i = 0; i < filenames.length; i++) {
      var filename = filenames[i].trim();

      // Generate a link to the recipe using the filename
      var link = document.createElement("a");
      link.href = recipesPath + filename;
      link.textContent = filename.replace(".md", "");

      // Add the link to the recipe list
      var listItem = document.createElement("li");
      listItem.appendChild(link);
      recipeList.appendChild(listItem);
    }
  })
  .catch(error => console.error(error));
