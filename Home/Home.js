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
  TouchableOpacity,
  FlatList
} from 'react-native';

import RecipeManagerApi from '../Network/RecipeManagerApi'
import {Colors, Dimens} from '../Common/Constants'


export default class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      recipes: [],
      showDetails: false,
      recipeSelected: null
    }
  }

  showRecipeDetails = (recipe) => {
    this.setState({
      showDetails: true,
      recipeSelected: recipe
    })
  }

  hideRecipeDetails = () => {
    this.setState({
      showDetails: false
    })
  }

  renderRecipe = ({ item }) => {
    return (
      <View style = {appStyle.cardView}> 
        <View style = {{flexDirection: 'row'}}>
          <Text style = {appStyle.cardViewText}>Name: {item.name}</Text>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.medium}}>
          <Text style = {appStyle.cardViewText}>Category: {item.category}</Text>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.small}}>
          <View style = {{flex: 1}}>
            <Text style = {appStyle.cardViewText}>Duration: {item.duration}</Text>
          </View>
          <View style = {{flex: 1}}>
            <Text style = {appStyle.cardViewText}>Difficult: {item.difficult}</Text>
          </View>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.small, marginBottom: Dimens.small}}>
          <View style = {{flex: 1}}>
            <TouchableOpacity style={appStyle.cardViewButton} onPress = {() => this.showRecipeDetails(item)}>
              <Text style = {{color: Colors.primaryColor}}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style = {{flex: 1}}>
            <TouchableOpacity style={appStyle.cardViewButton}>
              <Text style = {{color: Colors.primaryColor}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  
  renderDetails = () => {
    return (
      <ScrollView style = {appStyle.cardView}> 
        <View style = {{flexDirection: 'row'}}>
          <Text style = {appStyle.cardViewText}>Name: {this.state.recipeSelected.name}</Text>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.medium}}>
          <Text style = {appStyle.cardViewText}>Category: {this.state.recipeSelected.category}</Text>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.medium}}>
          <View style = {{flex: 1}}>
            <Text style = {appStyle.cardViewText}>Duration: {this.state.recipeSelected.duration}</Text>
          </View>
          <View style = {{flex: 1}}>
            <Text style = {appStyle.cardViewText}>Difficult: {this.state.recipeSelected.difficult}</Text>
          </View>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.medium}}>
          <View style = {{flex: 1}}>
            <Text style = {appStyle.cardViewText}>Subcategories: </Text>
            <View style = {{marginLeft: Dimens.small}}>
              {this.renderSubcategories(this.state.recipeSelected.subcategories)}
            </View>
          </View>
          <View style = {{flex: 1}}>
            <Text style = {appStyle.cardViewText}>Ingredients: </Text>
            <View style = {{marginLeft: Dimens.small}}>
              {this.renderIngredients(this.state.recipeSelected.ingredients)}
            </View>
          </View>
        </View>
        <View style = {{marginTop: Dimens.medium}} >
          <Text style = {appStyle.cardViewText}>Description: </Text>
        </View>
        <View style = {{marginLeft: Dimens.medium}}>
          <Text style = {appStyle.cardViewText}>{this.state.recipeSelected.description}</Text>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.medium}}>
          <Text style = {appStyle.cardViewText}>Calories: </Text>
          <Text style = {appStyle.cardViewText}>{this.state.recipeSelected.ingredients.reduce((a, b) => a + b.calories, 0)}</Text>
        </View>
        <View style = {{flexDirection: 'row', marginTop: Dimens.small, marginBottom: Dimens.small}}>
          <View style = {{flex: 1}}>
            <TouchableOpacity style={appStyle.cardViewButton} onPress = {() => this.hideRecipeDetails()}>
              <Text style = {{color: Colors.primaryColor}}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }

  renderSubcategories = (subcategories) => {
    return subcategories.map((item, index) =>
      <Text key = {index} style = {appStyle.cardViewText}>- {item.value}</Text>
    )
  }

  renderIngredients = (ingredients) => {
    return ingredients.map((item, index) =>
      <Text key = {index} style = {appStyle.cardViewText}>- {item.name}</Text>
    )
  }

  renderBookRecipe = () => {
    return (
      <FlatList
        data = {this.state.recipes}
        renderItem = {this.renderRecipe}
      />
    )
  }

  render() {
    let apiClient = new RecipeManagerApi() 
    apiClient.getRecipesFromUser('user').then(result => {
      this.setState({
        recipes: result.recipesResult
      })
    })

    return (
      <View> 
        {this.state.showDetails ?
            this.renderDetails()
          : 
            this.renderBookRecipe()
        } 
      </View>
    )
  }
}

const appStyle = StyleSheet.create({
  cardView: {
    elevation: Dimens.tiny,
    marginTop: Dimens.small,
    marginLeft: Dimens.small,
    marginRight: Dimens.small,
    marginBottom: Dimens.small,
    borderRadius: Dimens.small,
    padding: Dimens.small,
    backgroundColor: Colors.primaryColor
  },
  cardViewText: {
    color: Colors.white
  },
  cardViewButton: {
    elevation: Dimens.tiny,
    backgroundColor: Colors.white,
    borderRadius: Dimens.small,
    height: Dimens.big,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimens.medium,
    marginLeft: Dimens.small,
    marginRight: Dimens.small
  },
})