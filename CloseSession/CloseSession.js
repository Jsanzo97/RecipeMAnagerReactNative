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

export default class CloseSession extends React.Component {
    render() {
        return(
            <Text> Bye </Text>
        )
    }
}