import { AuthProvider } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  let isAuth = false;

  useEffect(() => {
    if (isAuth) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isAuth]);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
