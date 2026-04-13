import {useAuth} from "@/context/AuthContext";
import {uploadPostImage} from "@/lib/supabase/storage";
import {supabase} from "@/lib/supabase/client";
import {useEffect, useState} from "react";


export interface PostUserType {
    id: string;
    name: string;
    username: string;
    avatar: string;
}

export interface PostType {
    id: string,
    user_id: string,
    image_url: string,
    description?: string | null,
    expires_at: string,
    created_at: string,
    is_active: boolean,
    profiles?: PostUserType
}


export const
    usePosts = () => {

        const [posts, setPosts] = useState<PostType[]>([]);

        const [isLoading, setIsLoading] = useState<boolean>(false);

        const {user} = useAuth();


        useEffect(() => {
            loadPosts()
        }, []);

        const loadPosts = async () => {
            if (!user) return;
            setIsLoading(true)
            try {
                const {data, error} = await supabase
                    .from("posts")
                    .select("*, profiles(id, name, username, avatar)")
                    .eq("is_active", true)
                    .gt("expires_at", new Date().toISOString())
                    .order("created_at", {ascending: false});

                console.log("posts", data);

                if (error) {
                    console.error("Error loading posts:", error);
                    throw error;
                }
                const postWithProfiles = data.map(post => ({
                    ...post,
                    profiles: post.profiles || null,
                }));

                setPosts(postWithProfiles);

            } catch (error) {
                console.error("Error loading posts:", error);
            } finally {
                setIsLoading(false)
            }
        }


        const createPost = async (imageUri: string, description?: string, location?: {
            latitude: number,
            longitude: number
        }) => {
            if (!user) throw new Error("User not authenticated");
            try {
                const imageUrl = await uploadPostImage(user.id, imageUri);

                const now = new Date();
                const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

                const {error} = await supabase.from("posts").insert({
                    user_id: user.id,
                    image_url: imageUrl,
                    description: description || null,
                    expires_at: expiresAt.toISOString(),
                    is_active: true
                }).select().single()

                if (error) {
                    throw error;
                }


            } catch (error) {
                console.error("Error creating post:", error);
            }
        }
        const updatePost = () => {
        };
        const deletePost = () => {
        };
        return {
            createPost,
            updatePost,
            deletePost,
            posts,
            isLoading
        }
    }