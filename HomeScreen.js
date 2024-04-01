import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  // Estado para a foto selecionada
  const [foto, setFoto] = useState(null);
  // Estado para a localização atual do dispositivo
  const [location, setLocation] = useState(null);
  // Estado para o status da permissão da câmera
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  // Estado para o nome da memória
  const [nome, setNome] = useState("");
  // Estado para controlar o carregamento do mapa
  const [loadingMap, setLoadingMap] = useState(false);

  // Efeito para solicitar permissões ao carregar o componente
  useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }
    verificaPermissoes();
  }, []);

  // Função para atualizar o estado do nome da memória
  const handleChangeNome = (text) => {
    setNome(text);
  };

  // Função para escolher uma foto da biblioteca do dispositivo
  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0]);
      obterLocalizacao();
    }
  };

  // Função para acessar a câmera e tirar uma foto
  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!imagem.canceled) {
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0]);
      obterLocalizacao();
    }
  };

  // Função para obter a localização atual do dispositivo
  const obterLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permissão para acessar a localização negada");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    setLoadingMap(true);
    console.log(location);
  };

  // Função para limpar a aplicação
  const limparApp = () => {
    setFoto(null);
    setLocation(null);
    setNome("");
    setLoadingMap(false);
  };

  // Função para salvar a memória com a foto e o nome
  const salvarMemoria = async () => {
    try {
      // Verifica se o nome foi preenchido
      if (nome.trim() === "") {
        alert("Por favor, dê um nome para esta memória.");
        return;
      }

      // Verifica se a localização está disponível
      if (!location) {
        alert("Não foi possível obter a localização. Tente novamente.");
        return;
      }

      // Salva a foto e o nome no AsyncStorage
      let memorias = await AsyncStorage.getItem("memorias");
      if (memorias) {
        memorias = JSON.parse(memorias);
      } else {
        memorias = [];
      }

      memorias.push({ foto, nome, location });
      await AsyncStorage.setItem("memorias", JSON.stringify(memorias));
      alert("Memória salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a memória:", error);
      alert("Erro ao salvar a memória. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.viewBotoes}>
        <Button
          style={estilos.tirarFoto}
          color="green"
          onPress={escolherFoto}
          title="📂 Ver fotos"
        />
        <Button
          style={estilos.verFoto}
          color="blue"
          onPress={acessarCamera}
          title="📸 Tirar foto"
        />
      </View>
      {foto && (
        <TextInput
          style={estilos.input}
          onChangeText={handleChangeNome}
          value={nome}
          placeholder="Dê um nome/título para esta memória"
        />
      )}

      {foto && (
        <View style={estilos.photoContainer}>
          <Image
            source={{ uri: foto.uri }}
            style={{ width: 300, height: 300 }}
          />
          <View style={estilos.viewBotoes}>
            <Button
              onPress={salvarMemoria}
              color="#4b0082"
              title=" 💾 Salvar"
            />
            <Button
              color="#4b0082"
              onPress={() => navigation.navigate("ListaMemorias")}
              title="📂 Biblioteca"
            />
          </View>
          {location && loadingMap ? (
            <MapView
              style={estilos.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Localização Atual"
                description="Você está aqui!"
              />
            </MapView>
          ) : (
            <ActivityIndicator size="large" color="#4b0082" />
          )}
        </View>
      )}

      {/* Botão para limpar a aplicação */}
      {foto && (
        <Button color="red" onPress={limparApp} title="🗑 Limpar aplicação" />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  tirarFoto: {
    backgroundColor: "yellow",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  photoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width - 40,
    height: 200,
    marginVertical: 20,
    padding: 10,
  },
  viewBotoes: {
    gap: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
