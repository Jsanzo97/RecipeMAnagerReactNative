import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import {Colors, Dimens} from '../Common/Constants'
import {Strings} from '../Common/Strings'
import RecipeManagerApi from '../Network/RecipeManagerApi'
import CustomDialog from '../Common/CustomDialog'
import {NavigationContainer} from '@react-navigation/native'

const { height } = Dimensions.get('window')
const imageHeight = (30 / 100) * height

export default class Login extends React.Component {

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
    this.props.navigation.setOptions({
      title: ''
    })
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
        this.props.navigation.navigate(Strings.tabBarNavigatorName)
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
      <View style = {appStyle.container}>  

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

        <View style = {{flexDirection: 'row'}}>
          <TouchableOpacity style = {appStyle.loginButton} onPress = {this.onSignUpAction}>
            <Text style = {appStyle.loginText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={appStyle.loginButton} onPress = {this.onLoginAction}>
            <Text style = {appStyle.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <CustomDialog visible = {this.state.showDialog} title = {this.state.titleDialog} message = {this.state.messageDialog}
          acceptHandleAction = {this.state.acceptHandleAction} cancelHandleAction = {this.state.cancelHandleAction}/>
  
      </View>
    );
  }
}

const appStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  logo: {
    marginTop: '20%',
    width: '50%',
    height: imageHeight
  },
  title: {
    fontWeight: 'bold',
    fontSize: Dimens.big,
    color: Colors.primaryColor,
    marginBottom: Dimens.small
  },
  inputView: {
    width: '75%',
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
    width: '35%',
    backgroundColor: Colors.primaryColor,
    borderRadius: Dimens.small,
    height: Dimens.big,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimens.medium,
    marginLeft: Dimens.small,
    marginRight: Dimens.small,
    elevation: Dimens.tiny
  },
  loginText: {
    color: Colors.white,
    fontSize: Dimens.medium
  }
});