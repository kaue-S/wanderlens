import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-community/async-storage";

export default function App() {
  const [location, setLocation] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [places, setPlaces] = useState([]);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setImage(photo.uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const savePlace = async () => {
    const newPlace = {
      id: Date.now().toString(),
      title: title,
      image: image,
      location: location,
    };
    const updatedPlaces = [...places, newPlace];
    setPlaces(updatedPlaces);
    await AsyncStorage.setItem("places", JSON.stringify(updatedPlaces));
    setTitle("");
    setImage(null);
    setLocation(null);
  };

  const loadPlaces = async () => {
    const placesData = await AsyncStorage.getItem("places");
    if (placesData) {
      setPlaces(JSON.parse(placesData));
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        type={Camera.Constants.Type.back}
      />
      <Button title="Tirar Foto" onPress={takePicture} />
      <Button title="Obter Localização" onPress={getLocation} />
      <TextInput
        style={styles.input}
        placeholder="Nome/Título"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Salvar Lugar" onPress={savePlace} />
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <Text>{`Latitude: ${item.location.coords.latitude}, Longitude: ${item.location.coords.longitude}`}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  camera: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    width: "80%",
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
