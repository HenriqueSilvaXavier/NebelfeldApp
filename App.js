import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Palavra from './Palavra';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerTitle: '', headerShown: false }} 
        />
        <Stack.Screen
          name="Palavra"
          component={Palavra}
          options={{ headerTitle: '' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}