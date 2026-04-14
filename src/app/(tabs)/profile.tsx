import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/context/AuthContext";
import {Image} from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {uploadAvatar} from "@/lib/supabase/storage";
import {useState} from "react";
import {useRouter} from "expo-router";

export default function Profile() {
    const {user, updateUser, logout} = useAuth();
    const router = useRouter();

    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const handleUpdateProfileImage = async () => {
        if (!user) return;
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
            setIsUpdating(true);
            try {
                const imageUrl = await uploadAvatar(user?.id, result.assets[0].uri)
                await updateUser({avatar: imageUrl});
                Alert.alert("Success", "Profile image updated")
            } catch (error) {
                console.error("Error updating profile image", error)
                Alert.alert("Error", "Error updating profile image")
            } finally {
                setIsUpdating(false);
            }
        }
    }

    const handleLogout = async () => {
        Alert.alert("Log out", "Are you sure to log out ?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Log out",
                style: "destructive",
                onPress: async () => {
                    await logout()
                    router.replace("/(auth)/login")
                }
            }
        ])
        await logout();
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={handleUpdateProfileImage} disabled={isUpdating}>
                        {user?.avatar ? (
                            <Image source={{uri: user.avatar}} style={styles.profileImage}
                                   cachePolicy={"none"}/>) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Text style={styles.profileImageText}>
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </Text>
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            <Text style={styles.editBadgeText}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.name}>{user?.name || "No name"}</Text>
                    <Text style={styles.username}>@{user?.username || "user"}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Edit Profile</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Notifications</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Privacy</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Help & Support</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Terms of Service</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Privacy Policy</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.settingItem, styles.signOutButton]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.settingItem, styles.deleteButton]}>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 32,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 32,
        paddingBottom: 32,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
    },
    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    profileImagePlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    profileImageText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 8,
    },
    editBadgeText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    username: {
        fontSize: 18,
        color: "#666",
    },
    email: {
        fontSize: 16,
        color: "#666",
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        color: "#000",
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#999"
    },
    settingLabel: {
        fontSize: 18,
        color: "#000",
    },
    settingValue: {
        fontSize: 18,
        color: "#000",
    },
    signOutButton: {
        borderWidth: 1,
        borderColor: "#ff3b30",
        marginBottom: 8,
    },
    signOutText: {
        fontSize: 16,
        color: "#ff3b30",
        fontWeight: "500",
    },
    deleteButton: {
        backgroundColor: "#ff3b30",
    },
    deleteText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
    },
});
