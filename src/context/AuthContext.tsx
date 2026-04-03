import { supabase } from "@/lib/supabase/client";
import { createContext, useContext, useState } from "react";

export type UserType = {
  id: string;
  name: string;
  email: string;
  username: string;
    avatar?: string;
  onboardingCompleted: boolean;
};

interface AuthContextType {
    user: UserType | null;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    
    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        if (data.user) {
            console.log("User logged in:", data.user);
        }
    };

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          console.log("User created:", data.user);
        }
    };

    const logout = async () => {
        
    };

  return (
    <AuthContext.Provider value={{user, login, register, logout}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

