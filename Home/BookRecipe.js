/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import RecipeManagerApi from './RecipeManagerApi'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      recipes: [],
      loading: true
    }
  }

  componentDidMount() {
    let apiClient = new RecipeManagerApi() 
    apiClient.getRecipesFromUser('user').then(result => {
      console.log('Recipes retrieved')
      console.log(result)
      this.setState({
        recipes: result.recipesResult,
        loading: false
      })
    })
  }

  renderRecipes() {
    if (this.state.loading)
      return (
        <Text style = {{fontWeight: 'bold', color: 'red'}}> Cargando... </Text>
        )
    else 
      return (
        this.state.recipes.map(recipe => {
          return <Text key = {recipe.name} style = {{fontWeight: 'bold', color: 'red'}}> {recipe.name} </Text>
        })
      )
  }

  render() {

    return (
      <SafeAreaView> 
      {
        this.renderRecipes()
      }
      </SafeAreaView>
    
    );

  }

}