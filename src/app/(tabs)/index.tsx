import {Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {useState} from "react";
import {Image} from "expo-image";
import {usePosts} from "@/hooks/usePosts";

export default function Index() {
    const router = useRouter();
    const {createPost} = usePosts();
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>();
    const [description, setDescription] = useState<string>("");


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
            setPreviewImage(result.assets[0].uri);
            setShowPreview(true);
            setDescription("");
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
            setPreviewImage(result.assets[0].uri);
            setShowPreview(true);
            setDescription("");
        }
    };

    const handlePost = async () => {
        if (!previewImage) return;

        try {
            await createPost(previewImage, description)
            setPreviewImage(null);
            setShowPreview(false);
            setDescription("");
            Alert.alert(
                "Success",
                "Your post has been successfully posted!"
            )
        } catch (error) {
            console.error("Error posting image:", error);
            Alert.alert(
                "Error",
                "Failed to post image. Please try again later."
            )
        }
    }

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
            <Modal visible={showPreview} transparent animationType={"fade"}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Preview your post here
                        </Text>
                        {previewImage &&
                            <Image style={styles.previewImage} source={{uri: previewImage}}
                                   contentFit={"cover"}/>}
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder={"Add a description (Optional)"}
                            placeholderTextColor={"#888"}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                            textAlignVertical={"top"}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]}
                                              onPress={() => {
                                                  setShowPreview(false);
                                                  setPreviewImage(null);
                                                  setDescription("");
                                              }}>
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.postButton]}>
                                <Text style={styles.postButtonText} onPress={handlePost}>
                                    Post
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    previewImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 5,
    },
    descriptionInput: {
        width: "100%",
        minHeight: 80,
        maxHeight: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        textAlignVertical: "top",
        backgroundColor: "#f5f5f5",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 12
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    postButton: {
        backgroundColor: "#5067FF",
    },
    postButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    cancelButtonText: {
        color: "#333",
        fontWeight: "bold",
    },
});
