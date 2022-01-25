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
  TextInput
} from 'react-native';

import {Picker} from '@react-native-picker/picker'
import RecipeManagerApi from '../Network/RecipeManagerApi'
import {Colors, Dimens, AsyncStorageKeys} from '../Common/Constants'
import CustomDialog from '../Common/CustomDialog'
import {Strings} from '../Common/Strings'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ingredientTypesAvailables: [],
            categoriesAvailables: [],
            subcategoriesAvailables: [],
            difficultiesAvailables: [],
            showNewIngredientForm: false,
            recipeName: "",
            recipeCategory: "STARTER",
            recipeDuration: "",
            recipeDifficult: "EASY",
            recipeIngredients: [],
            recipeDescription: "",
            recipeSubcategory: "COLD",
            ingredientName: "",
            ingredientType: "MEAT",
            ingredientCalories: "",
            showDialog: false,
            titleDialog: '',
            messageDialog: '',
            acceptHandleAction: () => {},
            cancelHandleAction: () => {}
        }
        this.recipeManagerApi = new RecipeManagerApi()
        AsyncStorage.getItem(AsyncStorageKeys.usernameValue).then( (value) => { this.username = value } )
    }

    componentDidMount() {
        this.recipeManagerApi.getNewRecipeData().then(result => { 
        this.setState({
            ingredientTypesAvailables: result.ingredientTypesResult.values,
            categoriesAvailables: result.categoriesResult.values,
            subcategoriesAvailables: result.subcategoriesResult.values,
            difficultiesAvailables: result.difficultiesResult.values
            })
        })
    }

    showNewIngredientForm = () => {
        this.setState({
            showNewIngredientForm: true
        })
    }

    showNewRecipeForm = () => {
        this.ingredientNameInput.clear()
        this.setState({
            showNewIngredientForm: false,
        })
        this.clearNewIngredientForm()
    }

    clearNewRecipeForm = () => {
        this.recipeNameInput.clear()
        this.recipeDurationInput.clear()
        this.recipeDescriptionInput.clear()
        this.setState({
            recipeName: "",
            recipeCategory: "STARTER",
            recipeDuration: "",
            recipeDifficult: "EASY",
            recipeIngredients: [],
            recipeDescription: "",
            recipeSubcategory: "COLD"
        })
    }

    clearNewIngredientForm = () => {
        this.ingredientNameInput.clear()
        this.ingredientCaloriesInput.clear()
        this.setState({
            ingredientName: "",
            ingredientType: "MEAT",
            ingredientCalories: ""
        })
    }

    createNewIngredient = () => {
        if (this.checkIngredientValidFields()) {
            if (!this.state.recipeIngredients.some(item => this.state.ingredientName === item.name)) {
                let ingredients = this.state.recipeIngredients
                ingredients.push({
                    name: this.state.ingredientName,
                    type: this.state.ingredientType,
                    calories: this.state.ingredientCalories
                }) 
                this.setState({recipeIngredients: ingredients})
                this.showMessage(
                    Strings.sucessOperation,
                    Strings.newIngredientCreated,
                    () => {
                        this.setState({
                            showDialog: false,
                        })
                        this.clearNewIngredientForm()
                    },
                    () => {
                        this.setState({
                            showDialog: false
                        })
                        this.showNewRecipeForm()
                    }
                )
            } else {
                this.showMessage(
                    Strings.errorOperation,
                    Strings.newIngredientWithThisNameAlreadyExists,
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
        } else {
            this.showMessage(
                Strings.errorOperation,
                Strings.newIngredientEmptyFields,
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
    }

    createNewRecipe() {
        let userRecipe = {
            name: this.state.recipeName,
            description: this.state.recipeDescription,
            durationInHours: parseFloat(this.state.recipeDuration.replace(",", ".")),
            difficult: this.state.recipeDifficult,
            ingredients: this.state.recipeIngredients,
            category: this.state.recipeCategory,
            subcategories: [{value: this.state.recipeSubcategory}]
        }

        if (this.checkRecipeInvalidFields(userRecipe)) {
            this.showMessage(
                Strings.errorOperation,
                Strings.newRecipeEmptyFields,
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
        } else {
            console.log(this.username);
            this.recipeManagerApi.createNewRecipe(this.username, userRecipe)
                .then(response => {
                    if (response.success) {
                        this.onSuccessCreateNewRecipe(response.successMessage)
                    } else {
                        this.onErrorCreateNewRecipe(response.errorMessage)
                    }
                }
            )
        }        
    }

    checkRecipeInvalidFields(userRecipe) {
        return userRecipe.name == "" || userRecipe.description == "" || userRecipe.durationInHours == "" || parseFloat(userRecipe.durationInHours) <= 0 || userRecipe.difficult == "" || userRecipe.ingredients.length == 0 || userRecipe.category == "" || userRecipe.subcategories.length == 0
    }

    checkIngredientValidFields() {
        return this.state.ingredientName != "" && this.state.ingredientType != "" && this.state.ingredientCalories > 0.0
    }

    onSuccessCreateNewRecipe(message) {
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
        this.clearNewRecipeForm()
    }

    onErrorCreateNewRecipe(message) {
        this.showMessage(
            Strings.errorOperation,
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

    renderCategoryPickerItems = (categories) => {
        return categories.map((item, index) =>
            <Picker.Item style = {appStyle.pickerItemStyle} key = {index} label = {item.category} value = {item.category} />
        )
    }

    renderSubcategoryPickerItems = (subcategories) => {
        return subcategories.map((item, index) =>
            <Picker.Item style = {appStyle.pickerItemStyle} key = {index} label = {item.value} value = {item.value} />
        )
    }

    renderIngredientTypesPickerItems = (types) => {
        return types.map((item, index) =>
            <Picker.Item style = {appStyle.pickerItemStyle} key = {index} label = {item.type} value = {item.type} />
        )
    }

    renderDifficultiesPickerItems = (difficulties) => {
        return difficulties.map((item, index) =>
            <Picker.Item style = {appStyle.pickerItemStyle} key = {index} label = {item.difficult} value = {item.difficult} />
        )
    }

    renderIngredients = (ingredients) => {
        return ingredients.map((item, index) =>
            <View key = {index} style = {{marginTop: Dimens.small, marginLeft: Dimens.small}}>
                <Text key = {index} style = {appStyle.cardViewText}>- {item.name}</Text> 
            </View>
        )
    }

    renderNewRecipeForm = () => {
        return(
            <View style = {appStyle.cardView}> 
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {appStyle.cardViewText}>Name: </Text>
                    <View style = {{flex: 1}}>
                        <TextInput  
                            ref= {recipeNameInput => { this.recipeNameInput = recipeNameInput }} 
                            style = {appStyle.inputText}
                            placeholder = 'Recipe name'
                            value = {this.state.recipeName} 
                            placeholderTextColor = {Colors.primaryColor}
                            onChangeText = {text => this.setState({recipeName: text})}
                        />
                    </View>
                </View>                        
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {appStyle.cardViewText}>Category: </Text>
                    <View style = {{flex: 1}}>                                
                        <Picker
                            style = {appStyle.pickerStyle}
                            mode = 'dropdown'
                            dropdownIconColor = {Colors.white}
                            selectedValue = {this.state.recipeCategory}
                            onValueChange = {(itemValue, itemIndex) => this.setState({recipeCategory: itemValue})}>
                            {this.renderCategoryPickerItems(this.state.categoriesAvailables)}
                        </Picker>
                    </View>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: Dimens.medium}}>
                    <Text style = {appStyle.cardViewText}>Duration in hours: </Text>
                    <View style = {{flex: 1}}>                                
                        <TextInput  
                            ref= {recipeDurationInput => { this.recipeDurationInput = recipeDurationInput }} 
                            style = {appStyle.inputText}
                            keyboardType='numeric'
                            placeholder = 'Duration'
                            value = {this.state.recipeDuration} 
                            placeholderTextColor = {Colors.primaryColor}
                            onChangeText = {text => this.setState({recipeDuration: text})}
                        />
                    </View>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {appStyle.cardViewText}>Difficult: </Text>
                    <View style = {{flex: 1}}>                                
                        <Picker
                            style = {appStyle.pickerStyle}
                            mode = 'dropdown'
                            dropdownIconColor = {Colors.white}
                            selectedValue = {this.state.recipeDifficult}
                            onValueChange = {(itemValue, itemIndex) => this.setState({recipeDifficult: itemValue})}>
                            {this.renderDifficultiesPickerItems(this.state.difficultiesAvailables)}
                        </Picker>
                    </View>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {appStyle.cardViewText}>Subcategory: </Text>
                    <View style = {{flex: 1}}>                                
                        <Picker
                            style = {appStyle.pickerStyle}
                            mode = 'dropdown'
                            dropdownIconColor = {Colors.white}
                            selectedValue = {this.state.recipeSubcategory}
                            onValueChange = {(itemValue, itemIndex) => this.setState({recipeSubcategory: itemValue})}>
                            {this.renderSubcategoryPickerItems(this.state.subcategoriesAvailables)}
                        </Picker>
                    </View>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: Dimens.medium}}>
                <View style = {{flex: 1}}>
                    <Text style = {appStyle.cardViewText}>Ingredients: </Text> 
                    </View>
                    <View style = {{flex: 1, marginLeft: Dimens.small}}>
                        <TouchableOpacity style = {appStyle.cardViewButton} onPress = {() => this.showNewIngredientForm()}>
                            <Text style = {{color: Colors.primaryColor}}>Add New Ingredient</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderIngredients(this.state.recipeIngredients)}
                <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: Dimens.big}}>
                    <Text style = {appStyle.cardViewText}>Description: </Text>
                    <View style = {{flex: 1}}>                                
                        <TextInput  
                            ref= {recipeDescriptionInput => { this.recipeDescriptionInput = recipeDescriptionInput }} 
                            style = {appStyle.inputText}
                            placeholder = 'Description'
                            value = {this.state.recipeDescription}
                            placeholderTextColor = {Colors.primaryColor}
                            onChangeText = {text => this.setState({recipeDescription: text})}
                        />
                    </View>
                </View>
                <View style = {{flexDirection: 'row', marginTop: Dimens.medium, marginBottom: Dimens.small}}>
                    <View style = {{flex: 1, marginTop: Dimens.medium, marginRight: Dimens.small}}>
                        <TouchableOpacity style={appStyle.cardViewButton} onPress = {() => this.clearNewRecipeForm()}>
                            <Text style = {{color: Colors.primaryColor}}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex: 1, marginTop: Dimens.medium, marginLeft: Dimens.small}}>
                        <TouchableOpacity style={appStyle.cardViewButton} onPress = {() => this.createNewRecipe()}>
                            <Text style = {{color: Colors.primaryColor}}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderNewIngredientForm = () => {
        return(
            <View style = {appStyle.cardView}> 
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {appStyle.cardViewText}>Name: </Text>
                    <View style = {{flex: 1}}>
                        <TextInput 
                            ref= {ingredientNameInput => { this.ingredientNameInput = ingredientNameInput }} 
                            style = {appStyle.inputText}
                            placeholder = 'Ingredient name' 
                            placeholderTextColor = {Colors.primaryColor}
                            onChangeText = {text => this.setState({ingredientName: text})}
                        />
                    </View>
                </View>                        
                <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: Dimens.medium}}>
                    <Text style = {appStyle.cardViewText}>Type: </Text>
                    <View style = {{flex: 1}}>                                
                        <Picker
                            style = {appStyle.pickerStyle}
                            mode = 'dropdown'
                            dropdownIconColor = {Colors.white}
                            selectedValue = {this.state.ingredientType}
                            onValueChange = {(itemValue, itemIndex) => this.setState({ingredientType: itemValue})}>
                            {this.renderIngredientTypesPickerItems(this.state.ingredientTypesAvailables)}
                        </Picker>
                    </View>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: Dimens.medium}}>
                    <Text style = {appStyle.cardViewText}>Calories: </Text>
                    <View style = {{flex: 1}}>                                
                        <TextInput 
                            ref= {ingredientCaloriesInput => { this.ingredientCaloriesInput = ingredientCaloriesInput }}  
                            style = {appStyle.inputText}
                            keyboardType='numeric'
                            placeholder = 'Calories' 
                            placeholderTextColor = {Colors.primaryColor}
                            onChangeText = {text => this.setState({ingredientCalories: parseFloat(text.replace(",", "."))})}
                        />
                    </View>
                </View>
                <View style = {{flexDirection: 'row', marginTop: Dimens.medium, marginBottom: Dimens.small}}>
                    <View style = {{flex: 1, marginTop: Dimens.medium, marginRight: Dimens.small}}>
                        <TouchableOpacity style={appStyle.cardViewButton} onPress = {() => this.showNewRecipeForm()}>
                            <Text style = {{color: Colors.primaryColor}}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex: 1, marginTop: Dimens.medium, marginLeft: Dimens.small}}>
                        <TouchableOpacity style={appStyle.cardViewButton} onPress = {() => this.createNewIngredient()}>
                            <Text style = {{color: Colors.primaryColor}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return(
            <View> 
                {this.state.showNewIngredientForm ?
                    this.renderNewIngredientForm()
                : 
                    this.renderNewRecipeForm()
                } 
                <CustomDialog visible = {this.state.showDialog} title = {this.state.titleDialog} message = {this.state.messageDialog}
                    acceptHandleAction = {this.state.acceptHandleAction} cancelHandleAction = {this.state.cancelHandleAction}/>
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
    justifyContent: 'center'
  },
  inputText: {
    color: Colors.primaryColor,
    backgroundColor: Colors.white,
    marginLeft: Dimens.small,
    borderRadius: Dimens.small
  },
  pickerStyle: {
    color: Colors.white,
    backgroundColor: Colors.primaryColor
  },
  pickerItemStyle: {
    color: Colors.white,
    backgroundColor: Colors.primaryColor
  }
})