import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { api } from "../lib/api";
import { storeSession, useSession } from "../state/session";
import { colors } from "../theme";

export function AuthScreen(_props: NativeStackScreenProps<RootStackParamList, "Auth">) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useSession();

  async function submit() {
    setLoading(true);
    try {
      const next = mode === "login" ? await api.login({ email, password }) : await api.signup({ name, email, password });
      const session = { token: next.token, user: next.user };
      await storeSession(session);
      setSession(session);
    } catch (error) {
      Alert.alert("Authentication failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.title}>Familia Connect</Text>
        <Text style={styles.subtitle}>Build and preserve your family story from anywhere.</Text>
        <View style={styles.tabs}>
          <Button variant={mode === "login" ? "primary" : "secondary"} onPress={() => setMode("login")}>Login</Button>
          <Button variant={mode === "signup" ? "primary" : "secondary"} onPress={() => setMode("signup")}>Signup</Button>
        </View>
        {mode === "signup" && <TextField placeholder="Full name" value={name} onChangeText={setName} autoCapitalize="words" />}
        <TextField placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button disabled={loading} onPress={submit}>{loading ? "Please wait" : mode === "login" ? "Login" : "Create account"}</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: colors.paper
  },
  panel: {
    gap: 12,
    borderRadius: 12,
    padding: 18,
    backgroundColor: colors.white
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.ink
  },
  subtitle: {
    color: colors.muted,
    marginBottom: 8
  },
  tabs: {
    flexDirection: "row",
    gap: 8
  }
});
