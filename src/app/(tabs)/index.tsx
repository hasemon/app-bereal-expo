import {Alert, StyleSheet, Text, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

export default function Index() {
    const router = useRouter();

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
            // setAvatar(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            // setAvatar(result.assets[0].uri);
        }
    };

    const showImagePicker = () => {
        Alert.alert("Select Image", "Choose an option", [
            {text: "Cancel", style: "cancel"},
            {text: "Camera", onPress: takePhoto},
            {text: "Gallery", onPress: handleImagePicker},
        ]);
    };

    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 24,
        bottom: 24,
        backgroundColor: "#5067FF",
        width: 56,
        height: 56,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fabText: {
        color: "white",
        fontSize: 30,
    },
});
