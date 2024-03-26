import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Button, Alert } from "react-native";
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
      <Text style={styles.localizacao}>{item.localizacao}</Text>
    </View>
  );

  const excluirTodosItens = () => {
    // Exibe um alerta de confirmação
    Alert.alert(
      "Excluir todos os itens",
      "Tem certeza que deseja excluir todos os itens da biblioteca?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            // Limpa o estado de memórias
            setMemorias([]);
            // Salva o estado vazio no AsyncStorage
            AsyncStorage.setItem("memorias", JSON.stringify([]));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* FlatList para exibir a lista de memórias */}
      <FlatList
        data={memorias}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {memorias.length > 0 && (
        <Button color="red" onPress={excluirTodosItens} title="Excluir Todos os Itens" />
      )}
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
  localizacao: {
    fontSize: 16,
    color: "#777",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
});
