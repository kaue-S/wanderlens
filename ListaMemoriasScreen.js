import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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

  // Função para obter o endereço usando geocodificação
  const obterEndereco = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=SUA_CHAVE_DE_API_DO_GOOGLE_MAPS`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return "Endereço não encontrado";
      }
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
      return "Erro ao obter endereço";
    }
  };

  // Função para renderizar cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.foto.uri }} style={styles.image} />
      <Text style={styles.title}>{item.nome}</Text>
      <Text style={styles.localizacao}>
        {item.location.latitude}
        {item.location.longitude}
      </Text>
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
        <Button
          color="red"
          onPress={excluirTodosItens}
          title="Excluir Todos os Itens"
        />
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
