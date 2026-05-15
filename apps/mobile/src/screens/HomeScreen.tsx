import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { LogOut } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { api } from "../lib/api";
import { storeSession, useSession } from "../state/session";
import { colors } from "../theme";
import type { FamilyTree } from "../types";

export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">) {
  const { session, setSession } = useSession();
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    if (!session) return;
    setTrees(await api.trees(session.token));
  }, [session]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function createTree() {
    if (!session || !name.trim()) return;
    const tree = await api.createTree(session.token, { name, description });
    setTrees((items) => [tree, ...items]);
    setName("");
    setDescription("");
  }

  async function logout() {
    await storeSession(null);
    setSession(null);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Welcome</Text>
          <Text style={styles.title}>{session?.user.name}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={logout} style={styles.iconButton}>
          <LogOut color={colors.ink} size={20} />
        </Pressable>
      </View>
      <View style={styles.createPanel}>
        <Text style={styles.sectionTitle}>Create family tree</Text>
        <TextField placeholder="Tree name" value={name} onChangeText={setName} />
        <TextField placeholder="Description" value={description} onChangeText={setDescription} />
        <Button onPress={createTree}>Create tree</Button>
      </View>
      <FlatList
        data={trees}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.treeCard}
            onPress={() => navigation.navigate("Tree", { treeId: item._id, treeName: item.name })}
            onLongPress={() => Alert.alert(item.name, item.description || "No description")}
          >
            <Text style={styles.treeName}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.treeDescription}>{item.description || "No description yet"}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.paper
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  eyebrow: {
    color: colors.muted
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.ink
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  createPanel: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginBottom: 16
  },
  sectionTitle: {
    fontWeight: "800",
    color: colors.ink,
    fontSize: 17
  },
  list: {
    gap: 10,
    paddingBottom: 24
  },
  treeCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(23, 32, 27, 0.10)"
  },
  treeName: {
    fontWeight: "900",
    color: colors.ink,
    fontSize: 18
  },
  treeDescription: {
    marginTop: 4,
    color: colors.muted
  }
});
