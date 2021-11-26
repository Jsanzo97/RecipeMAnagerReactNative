import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Colors, Dimens} from '../Common/Constants'
import {Strings} from '../Common/Strings'
import RecipeManagerApi from '../Network/RecipeManagerApi'
import CustomDialog from '../Common/CustomDialog'

export default class App extends React.Component {

  constructor(props) {
   super(props)
    this.state = {
      email: '',
      password: '',
      showDialog: false,
      titleDialog: '',
      messageDialog: '',
      acceptHandleAction: () => {},
      cancelHandleAction: () => {}
    }
    this.recipeManagerApi = new RecipeManagerApi()
  }

  onLoginAction = () => {
    if(this.checkValidFields()) {
      this.recipeManagerApi.login(this.state.email, this.state.password)
        .then(response => {
            if (response.success) {
              this.onSuccessLoginOperation(response.successMessage)
            } else {
              this.onErrorOperation(response.errorMessage)
            }
          }
        )
    } else {
      this.onErrorOperation(Strings.loginScreenErrorEmptyFields)
    }
  }

  onSignUpAction = () => {
    if(this.checkValidFields()) {
      this.recipeManagerApi.signUp(this.state.email, this.state.password)
        .then(response => {
          if (response.success) {
            this.onSuccessSignUpOperation(response.successMessage)
          } else {
            this.onErrorOperation(response.errorMessage)
          }
        }
      )
    } else {
      this.onErrorOperation(Strings.loginScreenErrorEmptyFields)
    }
  }

  checkValidFields = () => {
    return this.state.email != '' && this.state.password != ''
  }

  onSuccessLoginOperation = (message) => {
    this.showMessage(
      Strings.sucessOperation,
      message,
      () => {
        this.setState({
          showDialog: false
        })
        // Navigate to home screen
        },
      () => {
        this.setState({
          showDialog: false
        })
      }
    )
  }

  onSuccessSignUpOperation = (message) => {
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

  onErrorOperation = (message) => {
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

  render() {

    return (
      <SafeAreaView style = {appStyle.container}>
        <StatusBar backgroundColor = {Colors.primaryColor} barStyle = 'light-content'/>
        <Image style={appStyle.logo} source={require('../Resources/splash_login_bg.png')}/>
        <Text style = {appStyle.title}> Recipe Manager</Text>
        <View style = {appStyle.inputView} >
          <TextInput  
            style = {appStyle.inputText}
            placeholder = 'Email' 
            placeholderTextColor = {Colors.primaryColor}
            onChangeText = {text => this.setState({email: text})}/>
        </View>
        <View style = {appStyle.inputView} >
          <TextInput  
            secureTextEntry
            style = {appStyle.inputText}
            placeholder = 'Password' 
            placeholderTextColor = {Colors.primaryColor}
            onChangeText = {text => this.setState({password: text})}/>
        </View>
      
        <TouchableOpacity style={appStyle.loginButton} onPress = {this.onLoginAction}>
          <Text style = {appStyle.loginText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {appStyle.loginButton} onPress = {this.onSignUpAction}>
          <Text style = {appStyle.loginText}>Sign up</Text>
        </TouchableOpacity>

        <CustomDialog visible = {this.state.showDialog} title = {this.state.titleDialog} message = {this.state.messageDialog}
          acceptHandleAction = {this.state.acceptHandleAction} cancelHandleAction = {this.state.cancelHandleAction}/>
  
      </SafeAreaView>
    );
  }
}

const appStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white
  },
  logo: {
    width: '50%',
    height: '30%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: Dimens.big,
    color: Colors.primaryColor,
    marginBottom: Dimens.small
  },
  inputView: {
    width: '80%',
    backgroundColor: Colors.white,
    height: Dimens.huge,
    marginBottom: Dimens.small,
    justifyContent: 'center',
    padding: Dimens.small
  },
  inputText: {
    height: Dimens.huge,
    color: Colors.primaryColor,
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 2
  },
  loginButton: {
    width: '80%',
    backgroundColor: Colors.primaryColor,
    borderRadius: Dimens.big / 2,
    height: Dimens.big,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimens.medium
  },
  loginText: {
    color: Colors.white,
    fontSize: Dimens.medium
  }
});