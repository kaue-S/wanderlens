import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen"; // Supondo que você já tenha o componente HomeScreen
import ListaMemoriasScreen from "./ListaMemoriasScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Memórias" }}
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
