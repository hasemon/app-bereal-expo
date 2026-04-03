import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {

  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back to BeReal</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            autoComplete="password"
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button}>
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text>
              Don't have an account? <Text onPress={() => router.push("/(auth)/register")} style={styles.linkText}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  form: {
    width: "80%",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  linkButton: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "blue",
    fontWeight: "bold",
  },
});

