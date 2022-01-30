import 'react-native-gesture-handler'
import React from 'react'
import Login from './Login/Login'
import Home from './Home/Home'
import NewRecipe from './NewRecipe/NewRecipe'
import CloseSession from './CloseSession/CloseSession'
import {StatusBar, Image, Text} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Strings} from './Common/Strings'
import {Colors, Dimens} from './Common/Constants'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigatorComponent = () => {
    return (
      <Tab.Navigator 
        screenOptions = {{ 
          headerShown: false, 
          tabBarHideOnKeyboard: true,
          tabBarStyle: [{ display: "flex" }, null]
        }}
        initialRouteName = {Strings.homeScreenName}
        backBehaviour = 'none'>
        <Tab.Screen
          name = {Strings.newRecipeScreenName}
          component = {NewRecipe}  
          options = {{
            tabBarIcon: ({focused}) => (
              <Image
                  source = {require('./Resources/newRecipe-icon.png')}
                  style = {{
                    width: Dimens.tabBarIconSize,
                    height: Dimens.tabBarIconSize,
                  }}
                  tintColor = {focused ? Colors.primaryColor : Colors.black}
                />
              ),
            tabBarLabel: ({focused}) => (
              <Text 
                style = {{
                  color: focused ? Colors.primaryColor : Colors.black
                }}>
                {Strings.newRecipeScreenName}
              </Text>
            )
          }}
        />
        <Tab.Screen
          name = {Strings.homeScreenName}
          component = {Home} 
          options = {{
            tabBarIcon: ({focused}) => (
              <Image
                  source = {require('./Resources/bookRecipe-icon.png')}
                  style = {{
                    width: Dimens.tabBarIconSize,
                    height: Dimens.tabBarIconSize,
                  }}
                  tintColor = {focused ? Colors.primaryColor : Colors.black}
                />
              ),
            tabBarLabel: ({focused}) => (
              <Text 
                style = {{
                  color: focused ? Colors.primaryColor : Colors.black
                }}>
                {Strings.homeScreenName}
              </Text>
            )
          }} 
        />
        <Tab.Screen
          name = {Strings.closeSessionScreenName}
          component = {CloseSession}  
          options = {{
             tabBarIcon: ({focused}) => (
              <Image
                  source = {require('./Resources/closeSession-icon.png')}
                  style = {{
                    width: Dimens.tabBarIconSize,
                    height: Dimens.tabBarIconSize,
                  }}
                  tintColor = {focused ? Colors.primaryColor : Colors.black}
                />
              ),
            tabBarLabel: ({focused}) => (
              <Text 
                style = {{
                  color: focused ? Colors.primaryColor : Colors.black
                }}>
                {Strings.closeSessionScreenName}
              </Text>
            )
          }}
        />
      </Tab.Navigator>
    )
}

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor = {Colors.primaryColorDark} barStyle = {Platform.OS == "ios" ? 'dark-content' : 'light-content'}/>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name = {Strings.loginScreenName} component = {Login} />
          <Stack.Screen name = {Strings.tabBarNavigatorName} component = {TabNavigatorComponent} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

           
