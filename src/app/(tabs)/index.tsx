import {StyleSheet, Text, View} from "react-native";
import {Button, Host} from "@expo/ui/jetpack-compose";
import {useRouter} from "expo-router";

export default function Index() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text>Index src/app/index.tsx to Index this screen.</Text>
            <Host>
                <Button
                    onPress={() => router.push('/about')}>
                    <Text>
                        Navigate
                    </Text>
                </Button>
            </Host>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});
