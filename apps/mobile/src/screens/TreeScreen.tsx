import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Button } from "../components/Button";
import { MemberCard } from "../components/MemberCard";
import { TextField } from "../components/TextField";
import { api, memberFormData } from "../lib/api";
import { useSession } from "../state/session";
import { colors } from "../theme";
import type { FamilyTree, Gender, Member } from "../types";

export function TreeScreen({ route }: NativeStackScreenProps<RootStackParamList, "Tree">) {
  const { session } = useSession();
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");
  const [photo, setPhoto] = useState<{ uri: string; name: string; type: string } | null>(null);

  async function load() {
    if (!session) return;
    const data = await api.tree(session.token, route.params.treeId);
    setTree(data.tree);
    setMembers(data.members);
  }

  useEffect(() => {
    load();
  }, [route.params.treeId, session]);

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to add a profile image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!result.canceled) {
      setPhoto({ uri: result.assets[0].uri, name: "profile.jpg", type: "image/jpeg" });
    }
  }

  async function createMember() {
    if (!session || !fullName.trim() || !birthDate.trim()) return;
    try {
      const member = await api.createMember(session.token, route.params.treeId, memberFormData({
        fullName,
        gender: "unknown" as Gender,
        birthDate,
        biography,
        generation: 0,
        photo
      }));
      setMembers((items) => [member, ...items]);
      setFullName("");
      setBirthDate("");
      setBiography("");
      setPhoto(null);
    } catch (error) {
      Alert.alert("Unable to add member", error instanceof Error ? error.message : "Please try again.");
    }
  }

  const living = members.filter((member) => !member.deathDate).length;
  const generations = new Set(members.map((member) => member.generation)).size;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{members.length}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{living}</Text>
          <Text style={styles.statLabel}>Living</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{generations}</Text>
          <Text style={styles.statLabel}>Generations</Text>
        </View>
      </View>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Add member</Text>
        <TextField placeholder="Full name" value={fullName} onChangeText={setFullName} />
        <TextField placeholder="Birth date, YYYY-MM-DD" value={birthDate} onChangeText={setBirthDate} />
        <TextField placeholder="Biography or notes" value={biography} onChangeText={setBiography} multiline />
        <View style={styles.actions}>
          <Button variant="secondary" onPress={pickPhoto}>{photo ? "Photo selected" : "Choose photo"}</Button>
          <Button onPress={createMember}>Add member</Button>
        </View>
      </View>
      <Text style={styles.sectionTitle}>{tree?.name ?? route.params.treeName}</Text>
      <FlatList
        scrollEnabled={false}
        data={members}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.memberList}
        renderItem={({ item }) => <MemberCard member={item} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper
  },
  content: {
    padding: 16,
    gap: 14
  },
  stats: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.white
  },
  statValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12
  },
  form: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.white
  },
  actions: {
    gap: 10
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  memberList: {
    gap: 10
  }
});
