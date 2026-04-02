import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <View>
        <Text>Welcome to BeReal</Text>
        <Text>Login to continue</Text>
        <View>
          <TextInput placeholder="Username" />
          <TextInput placeholder="Password" />
          <Button title="Login" />
        </View>
      </View>
    </SafeAreaView>
  );
}
