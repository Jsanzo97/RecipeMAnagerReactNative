import 'react-native-gesture-handler'
import React from 'react'
import Login from './Login/Login'
import {NavigationContainer} from '@react-navigation/native'

export default class App extends React.Component {

  render() {

    return (
      <NavigationContainer >
        <Login/>
      </NavigationContainer>
    );
  }
}
