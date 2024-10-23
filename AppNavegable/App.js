import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/home';
import Login from './screens/login';
import Register from './screens/Register';
import CargarEvento from './screens/cargarEvento';
import aplicarEvento from './screens/aplicarEvento';


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CargarEvento" component={CargarEvento} />
        <Stack.Screen name="aplicarEvento" component={aplicarEvento} />
      </Stack.Navigator>
    </NavigationContainer>
  );}
