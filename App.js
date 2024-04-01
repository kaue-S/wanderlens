// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import ListaMemoriasScreen from "./ListaMemoriasScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Locais Visitados" }}
        />
        <Stack.Screen
          name="ListaMemorias"
          component={ListaMemoriasScreen}
          options={{ title: "Lista de Memórias" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
