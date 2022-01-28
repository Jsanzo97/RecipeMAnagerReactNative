import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';

import RecipeManagerApi from '../Network/RecipeManagerApi'
import {Colors, Dimens, AsyncStorageKeys} from '../Common/Constants'
import CustomDialog from '../Common/CustomDialog'
import {Strings} from '../Common/Strings'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      recipes: [],
      showDetails: false,
      recipeSelected: null,
      showDialog: false,
      titleDialog: '',
      messageDialog: '',
      acceptHandleAction: () => {},
      cancelHandleAction: () => {}
    }
    this.recipeManagerApi = new RecipeManagerApi() 
    
    AsyncStorage.getItem(AsyncStorageKeys.usernameValue).then( (value) => { this.username = value } )
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

  removeRecipe = (recipe) => {
    this.showMessage(
      Strings.confirmation,
      Strings.confirmRemoveRecipe,
      () => {
          this.recipeManagerApi.removeRecipe(this.username, recipe.name).then(response => {
            if (response.success) {
                this.onSuccessRemoveRecipe(response.successMessage)
            } else {
                this.onErrorRemoveRecipe(response.errorMessage)
            }
            this.setState({
              showDialog: false
            })
          })
      },
      () => {
          this.setState({
              showDialog: false
          })
      }
    )
  }

  onSuccessRemoveRecipe(message) {
    this.showMessage(
        Strings.sucessOperation,
        message,
        () => {
            this.setState({
                showDialog: false
            })
        },
        () => {
            this.setState({
                showDialog: false
            })
        }
    )
  }

  onErrorRemoveRecipe(message) {
    this.showMessage(
      Strings.sucessOperation,
      message,
      () => {
          this.setState({
              showDialog: false
          })
      },
      () => {
          this.setState({
              showDialog: false
          })
      }
    )
  }

  showMessage = (title, message, acceptHandleAction, cancelHandleAction) => {
      this.setState({
          showDialog: true,
          titleDialog: title,
          messageDialog: message,
          acceptHandleAction: acceptHandleAction,
          cancelHandleAction: cancelHandleAction
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
            <TouchableOpacity style = {appStyle.cardViewButton} onPress = {() => this.showRecipeDetails(item)}>
              <Text style = {{color: Colors.primaryColor}}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style = {{flex: 1}}>
            <TouchableOpacity style = {appStyle.cardViewButton} onPress = {() => this.removeRecipe(item)}>
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
    if (this.state.recipes && this.state.recipes.length > 0) {
      return (
        <FlatList
          data = {this.state.recipes}
          renderItem = {this.renderRecipe}
        />
      )
    } else {
      return (
        <View style = {{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Text style = {{color: Colors.primaryColor}}>There are no recipes created yet, press the new recipe button on the bottom left to create the first one! </Text>
        </View>
        
      )
    }
  }

  render() {
    this.recipeManagerApi.getRecipesFromUser(this.username).then(result => {
      this.setState({
        recipes: result.recipesResult
      })
    })

    return (
      <SafeAreaView> 
        {this.state.showDetails ?
            this.renderDetails()
          : 
            this.renderBookRecipe()
        } 
        <CustomDialog visible = {this.state.showDialog} title = {this.state.titleDialog} message = {this.state.messageDialog}
          acceptHandleAction = {this.state.acceptHandleAction} cancelHandleAction = {this.state.cancelHandleAction}/>
      </SafeAreaView>
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