import {supabase} from "@/lib/supabase/client";
import {createContext, useContext, useEffect, useState} from "react";

export type UserType = {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar?: string;
    onboarding_completed: boolean;
};

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<UserType>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId: string): Promise<UserType | null> => {
        try {
            // Get auth user first to ensure session is valid
            const {data: {user: authUser}, error: authError} = await supabase.auth.getUser();
            if (authError || !authUser) return null;

            const {data: profile, error} = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            return {
                id: userId,
                name: profile?.name || "",
                email: authUser.email || "",
                username: profile?.username || "",
                avatar: profile?.avatar || "",
                onboarding_completed: profile?.onboarding_completed || false,
            };
        } catch (error) {
            if ((error as any).code === "PGRST116") {
                const {data: {user: authUser}} = await supabase.auth.getUser();
                if (authUser) {
                    return {
                        id: userId,
                        name: "",
                        email: authUser.email || "",
                        username: "",
                        avatar: "",
                        onboarding_completed: false,
                    };
                }
            }
            console.log("Error fetching profile:", error);
            return null;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const {data: {session}} = await supabase.auth.getSession();
                if (session?.user) {
                    const profile = await fetchUserProfile(session.user.id);
                    setUser(profile);
                }
            } catch (error) {
                console.error("Auth init error:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        const {data: {subscription}} = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change:", event, session?.user?.id);

            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id);
                setUser(profile);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }
    };

    const register = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        if (data.user) {
            setUser({
                id: data.user.id,
                email: data.user.email || "",
                name: "",
                username: "",
                onboarding_completed: false,
            });
        }
    };

    const updateUser = async (userData: Partial<UserType>) => {
        try {
            if (!user) throw new Error("No user to update");

            const updateData: any = {};
            if (userData.name !== undefined) updateData.name = userData.name;
            if (userData.username !== undefined) updateData.username = userData.username;
            if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
            if (userData.onboarding_completed !== undefined)
                updateData.onboarding_completed = userData.onboarding_completed;

            delete updateData.email;

            const payload = {
                id: user.id,
                ...updateData,
                updated_at: new Date().toISOString(),
            };

            delete (payload as any).email;

            const {error} = await supabase
                .from("profiles")
                .upsert(payload);

            if (error) throw error;

            setUser((prev) => (prev ? {...prev, ...updateData} : null));
        } catch (error) {
            console.log("Error updating profile:", error);
            throw error;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
