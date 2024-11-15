document.addEventListener("DOMContentLoaded", () => {
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => loadRecipes(data));

    const recipeList = document.getElementById('recipe-list');
    const recipeDetails = document.getElementById('recipe-details');

    let currentRecipe;

    function loadRecipes(recipes) {
        let index = 0
        recipes.forEach((recipe) => {
            const button = document.createElement("button");
            button.textContent = recipe.name;
            button.addEventListener("click", () => displayRecipe(recipe));
            recipeList.appendChild(button);
            if (index === 0)
                displayRecipe(recipe)
            index++
        });
    }

    function displayRecipe(recipe) {
        currentRecipe = recipe;

        recipeDetails.innerHTML = `
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}" style="width: 100%; max-width: 400px;">
            <p><strong>Description:</strong> ${recipe.description}</p>
            <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
            <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <p><strong>Prep Time:</strong> ${convertTime(recipe.prepTime)}</p>
            <p><strong>Cook Time:</strong> ${convertTime(recipe.cookTime)}</p>
            <ul><strong>Ingredients:</strong>
                ${recipe.ingredients.map(ing => `<li>${ing.item}: ${ing.amount} ${ing.unit}</li>`).join("")}
            </ul>
            <ol><strong>Instructions:</strong>
                ${recipe.instructions.map(ins => `<li>${ins.text}</li>`).join("")}
            </ol>
            <p><strong>Nutritional Information:</strong></p>
            <ul>
                <li>Calories: ${recipe.nutritionalInfo.calories}</li>
                <li>Protein: ${recipe.nutritionalInfo.protein}g</li>
                <li>Carbohydrates: ${recipe.nutritionalInfo.carbohydrates}g</li>
                <li>Fat: ${recipe.nutritionalInfo.fat}g</li>
            </ul>
            <button onclick="doubleServings()">Double Servings</button>
            <button onclick="convertToImperial()">Convert to Imperial</button>
        `;
    }

    window.doubleServings = function() {
        const doubledIngredients = currentRecipe.ingredients.map(ing => {
            const amount = parseFloat(ing.amount);
            return `${ing.item}: ${amount * 2} ${ing.unit}`;
        });
        recipeDetails.querySelector("ul").innerHTML = doubledIngredients.map(ing => `<li>${ing}</li>`).join("");
    };

    window.convertToImperial = function() {
        const convertedIngredients = currentRecipe.ingredients.map(ing => {
            let amount = parseFloat(ing.amount);
            let unit = ing.unit;

            if (unit === "grams") {
                amount = (amount * 0.0353).toFixed(2);
                unit = "ounces";
            } else if (unit === "cups") {
                amount = amount * 1; // no change for cups
            } else if (unit === "teaspoons") {
                amount = (amount * 0.208).toFixed(2);
                unit = "fluid ounces";
            } else if (unit === "tablespoons") {
                amount = (amount * 0.5).toFixed(2);
                unit = "fluid ounces";
            }

            return `${ing.item}: ${amount} ${unit}`;
        });
        recipeDetails.querySelector("ul").innerHTML = convertedIngredients.map(ing => `<li>${ing}</li>`).join("");
    };

    function convertTime(minutes) {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? mins + ' minutes' : ''}`;
        }
        return `${minutes} minutes`;
    }
});
