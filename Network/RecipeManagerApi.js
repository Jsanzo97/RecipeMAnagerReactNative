import {Network} from '../Common/Constants'

export default class RecipeManagerApi
{

  login(user, password) {
    return fetch(`${Network.baseURl}${Network.login}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        password: password
      })
    })
    .then(response => this.processResponse(response))
    .then(processedResponse => ({
      success: processedResponse.status,
      successMessage: processedResponse.data.message,
      error: !processedResponse.status,
      errorMessage: processedResponse.data.error_description
    }))
    .catch((error) => console.log(` ${error}`))
  }

  signUp(user, password) {
    return fetch(`${Network.baseURl}${Network.signUp}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        password: password
      })
    })
    .then(response => this.processResponse(response))
    .then(processedResponse => ({
      success: processedResponse.status,
      successMessage: processedResponse.data.message,
      error: !processedResponse.status,
      errorMessage: processedResponse.data.error_description
    }))
    .catch((error) => console.log(` ${error}`))
  }


  getRecipesFromUser(user) {
    let url = `${Network.baseURl}${Network.getBookRecipes}?username=${user}`;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => ({
        recipesResult: responseJson.recipes
      }));
  }

  getNewRecipeData() {
    return Promise.all(
      [
        this.getIngredientTypes(), 
        this.getCategories(),
        this.getSubcategories(),
        this.getDifficults()
      ]
    ).then(data => ({
      ingredientTypesResult: data[0],
      categoriesResult: data[1],
      subcategoriesResult: data[2],
      difficultiesResult: data[3]
    }));
  }

  getIngredientTypes() {
    let url = `${Network.baseURl}${Network.getIngredientTypesAvailables}`;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => ({
        values: responseJson.ingredient_types
      }));
  }

  getCategories() {
    let url = `${Network.baseURl}${Network.getCategoriesAvailables}`;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => ({
        values: responseJson.categories
      }));
  }

  getSubcategories() {
    let url = `${Network.baseURl}${Network.getSubcategoriesAvailables}`;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => ({
        values: responseJson.subcategories
      }));
  }

  getDifficults() {
    let url = `${Network.baseURl}${Network.getDifficultiesAvailables}`;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => ({
        values: responseJson.difficulties
      }));
  }

  createNewRecipe(user, recipe) {
    let url = `${Network.baseURl}${Network.createNewRecipe}?username=${user}`;
    console.log(JSON.stringify({
        name: recipe.name,
        description: recipe.description,
        durationInHours: recipe.durationInHours,
        difficult: recipe.difficult,
        ingredients: recipe.ingredients,
        category: recipe.category,
        subcategories: recipe.subcategories
      }));
    return fetch(`${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: recipe.name,
        description: recipe.description,
        durationInHours: recipe.durationInHours,
        difficult: recipe.difficult,
        ingredients: recipe.ingredients,
        category: recipe.category,
        subcategories: recipe.subcategories
      })
    })
    .then(response => this.processResponse(response))
    .then(processedResponse => ({
      success: processedResponse.status,
      successMessage: processedResponse.data.message,
      error: !processedResponse.status,
      errorMessage: processedResponse.data.error_description
    }))
    .catch((error) => console.log(` ${error}`))

  }

  processResponse(response) {
    return Promise.all(
      [response.ok, response.json()]
    )
    .then(res => ({
      status: res[0],
      data: res[1]
    }));
  }

}