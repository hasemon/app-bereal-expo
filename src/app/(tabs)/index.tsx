import {StyleSheet, Text, View} from "react-native";
import {Button} from "@expo/ui/jetpack-compose";
import {useRouter} from "expo-router";

export default function Index() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text>Edit src/app/index.tsx to edit this screen.</Text>
            <Button
                onPress={() => router.push('/about')}>
                <Text>
                    Navigate
                </Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
