import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthScreen } from "./src/screens/AuthScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { TreeScreen } from "./src/screens/TreeScreen";
import { getStoredSession, Session, SessionProvider } from "./src/state/session";
import { colors } from "./src/theme";

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Tree: { treeId: string; treeName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getStoredSession().then((stored) => {
      setSession(stored);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.moss} />
      </View>
    );
  }

  return (
    <SessionProvider session={session} setSession={setSession}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.paper },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: colors.paper }
          }}
        >
          {session ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Familia Connect" }} />
              <Stack.Screen name="Tree" component={TreeScreen} options={({ route }) => ({ title: route.params.treeName })} />
            </>
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Familia Connect" }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SessionProvider>
  );
}
