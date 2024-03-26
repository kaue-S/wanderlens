import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaMemoriasScreen() {
  // Estado para armazenar as memórias
  const [memorias, setMemorias] = useState([]);

  // Efeito para carregar as memórias ao carregar o componente
  useEffect(() => {
    async function carregarMemorias() {
      try {
        // Tenta carregar as memórias do AsyncStorage
        const memoriaString = await AsyncStorage.getItem("memorias");
        if (memoriaString) {
          // Se existirem memórias, converte para um array e define como estado
          const memorias = JSON.parse(memoriaString);
          setMemorias(memorias);
        }
      } catch (error) {
        console.error("Erro ao carregar memórias:", error);
      }
    }

    // Chama a função para carregar as memórias
    carregarMemorias();
  }, []);

  // Função para renderizar cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.foto.uri }} style={styles.image} />
      <Text style={styles.title}>{item.nome}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FlatList para exibir a lista de memórias */}
      <FlatList
        data={memorias}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#fff",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    marginTop: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
});
