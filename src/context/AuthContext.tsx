import { supabase } from "@/lib/supabase/client";
import { createContext, useState } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    
    const login = async (email: string, password: string) => {
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

    const register = async (email: string, password: string) => {
        
    };

    const logout = async () => {
        
    };

  return (
    <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
  );
};
