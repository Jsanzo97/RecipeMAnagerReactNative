import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import {Colors, Dimens, AsyncStorageKeys} from '../Common/Constants'
import {Strings} from '../Common/Strings'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class CloseSession extends React.Component {

    closeSession = () => {
        AsyncStorage.setItem(AsyncStorageKeys.usernameValue, '')
        this.props.navigation.replace(Strings.loginScreenName)
    }

    render() {
        return (
            <SafeAreaView style = {appStyle.backgroundContainer}>
                <ImageBackground 
                    source = {require('../Resources/splash_login_bg.png')} 
                    style = {appStyle.closeSessionBackground} 
                    resizeMode = 'contain'
                    imageStyle = {{opacity: 0.2}}> 
                    <Text style = {appStyle.closeSessionText}>Thank you for use this application! Here you can close your session by pressing the button.</Text>
                    <Text style = {appStyle.closeSessionText}>Developed by Jorge Sanzo Hernando</Text>
                    <TouchableOpacity style = {appStyle.closeSessionButton} onPress = {() => this.closeSession()}>
                        <Text style = {{color: Colors.white}}>Close session</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </SafeAreaView>
        )
    }
}

const appStyle = StyleSheet.create({
    backgroundContainer: {
        backgroundColor: Colors.white
    },
    closeSessionBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.white
    },
    closeSessionText: {
        marginLeft: Dimens.medium,
        marginRight: Dimens.medium,
        marginTop: Dimens.small,
        color: Colors.primaryColor,
        textAlign: 'center',
        fontSize: Dimens.closeSessionFontsize,
    },
    closeSessionButton: {
        position: 'absolute',
        bottom: Dimens.medium,
        right: Dimens.medium,
        left: Dimens.medium,
        backgroundColor: Colors.primaryColor,
        borderRadius: Dimens.small,
        height: Dimens.big,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: Dimens.tiny
    }
})
  