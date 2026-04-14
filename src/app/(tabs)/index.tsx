import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {useState} from "react";
import {Image} from "expo-image";
import {PostType, usePosts} from "@/hooks/usePosts";
import {useAuth} from "@/context/AuthContext";
import {formatTimeAgo, formatTimeRemaining} from "@/lib/date-helper";

export interface PostCardProps {
    post: PostType;
    currentUserId?: string;
}

const PostCard = ({post, currentUserId}: PostCardProps) => {
    const postUser = post.profiles;
    const isOwnPost = post.user_id === currentUserId;

    return (
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                    {
                        postUser?.avatar ? (
                            <Image source={{uri: postUser.avatar}} style={styles.avatar}
                                   cachePolicy={"none"}/>) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text
                                    style={styles.avatarText}>{postUser?.name?.charAt(0).toUpperCase() || "U"}
                                </Text>
                            </View>
                        )
                    }
                    <View>
                        <Text
                            style={styles.username}>{isOwnPost ? "You" : `@${postUser?.name}`}</Text>
                        <Text style={styles.timeAgo}>{formatTimeAgo(post.created_at)}</Text>
                    </View>
                </View>
                <View style={styles.timeRemainingBadge}>
                    <Text style={styles.timeRemainingText}>
                        {formatTimeRemaining(post.expires_at)}
                    </Text>
                </View>
            </View>
            <Image
                source={{uri: post.image_url}}
                style={styles.postImage}
                contentFit={"cover"}
                cachePolicy={"none"}
            />
            <View style={styles.postFooter}>
                {post.description &&
                    <Text style={styles.postDescription}>{post.description}</Text>
                }
                <Text style={styles.postInfo}>
                    {
                        isOwnPost ? `Your post • Expires in ${formatTimeRemaining(post.expires_at)}` : `${postUser?.name}'s post • Expires in ${formatTimeRemaining(post.expires_at)}`
                    }
                </Text>
            </View>

        </View>
    );
}


export default function Index() {
    const router = useRouter();
    const {createPost, posts, refreshPosts} = usePosts();
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [description, setDescription] = useState<string>("");
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const {user} = useAuth();

    const userActivePost = posts.find(post => post.user_id === user?.id && post.is_active && new Date(post.expires_at) > new Date());

    const hasActivePost = !!userActivePost;


    const renderPosts = ({item}: { item: PostType }) => (
        <PostCard post={item} currentUserId={user?.id}/>
    );


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
        setIsUploading(true)
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
        } finally {
            setIsUploading(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            refreshPosts()
        } catch (error) {
            console.error("Refreshing failed", error)
        } finally {
            setRefreshing(false)
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

            <FlatList
                data={posts}
                renderItem={renderPosts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={posts.length === 0 ? styles.emptyContent : styles.content}
                ListEmptyComponent={<Text>No posts yet. Be the first to share!</Text>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            />

            <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
                <Text style={styles.fabText}>{hasActivePost ? "↻" : "+"}</Text>
            </TouchableOpacity>
            <Modal visible={showPreview} transparent animationType={"fade"}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {hasActivePost ? "Replace your post" : "Preview your post here"}
                        </Text>
                        {previewImage &&
                            <Image style={styles.previewImage} source={{uri: previewImage}}
                                   contentFit={"cover"} cachePolicy={"none"}/>}
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
                            editable={!isUploading}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]}
                                              disabled={isUploading}
                                              onPress={() => {
                                                  setShowPreview(false);
                                                  setPreviewImage(null);
                                                  setDescription("");
                                              }}>
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.postButton, isUploading && styles.disabledButton]}
                                disabled={isUploading}
                                onPress={handlePost}
                            >
                                {isUploading ? (
                                    <ActivityIndicator color="white"/>
                                ) : (
                                    <Text style={styles.postButtonText}>
                                        {hasActivePost ? "Replace" : "Post"}
                                    </Text>
                                )}
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
    content: {
        padding: 16,
        paddingBottom: 100
    },
    emptyContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
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
        justifyContent: "center",
    },
    postButton: {
        backgroundColor: "#5067FF",
    },
    disabledButton: {
        opacity: 0.7,
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
    postContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        marginVertical: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    postHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden"
    },
    avatarPlaceholder: {
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666"
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000"
    },
    timeAgo: {
        fontSize: 12,
        color: "#888"
    },
    timeRemainingBadge: {
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    timeRemainingText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600"
    },
    postImage: {
        width: "100%",
        aspectRatio: 1,
    },
    postFooter: {
        padding: 16
    },
    postDescription: {
        fontSize: 15,
        color: "#000",
        marginBottom: 8,
        lineHeight: 20
    },
    postInfo: {
        fontSize: 12,
        color: "#888",
        marginBottom: 16
    }
});
