import {useEffect} from "react";
import {Stack, useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";

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
            <>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
            </Stack>
            <StatusBar style="auto"/>
        </>
    );
}
