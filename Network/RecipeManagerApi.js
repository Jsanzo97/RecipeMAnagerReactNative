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
    let url = `${RecipeManagerApi.BASE_URL}/recipes?username=${user}`;
    console.log(url);
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => ({
        recipesResult: responseJson.recipes,
        finished: true
      }));
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