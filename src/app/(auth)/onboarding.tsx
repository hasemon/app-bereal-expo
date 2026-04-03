import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  const handleOnboarding = async () => {};

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>Add your info to continue</Text>
        <View style={styles.form}>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
            {avatar ? (
              <Image source={avatar} style={styles.image} contentFit="cover" transition={200} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>+</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TextInput
            placeholder="Name"
            keyboardType="default"
            autoComplete="name"
            autoCapitalize="words"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Username"
            autoComplete="username"
            autoCapitalize="none"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.button} onPress={handleOnboarding}>
            {loading ? (
              <ActivityIndicator color="white" size={24} />
            ) : (
              <Text>Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  form: {
    width: "100%",
    marginTop: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 40,
    color: "#888",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 8,
  },
  editBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
});
