import { format } from "date-fns";
import { Image, StyleSheet, Text, View } from "react-native";
import { UserRound } from "lucide-react-native";
import type { Member } from "../types";
import { colors } from "../theme";

export function MemberCard({ member }: { member: Member }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        {member.photoUrl ? <Image source={{ uri: member.photoUrl }} style={styles.image} /> : <UserRound color={colors.moss} />}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>{member.fullName}</Text>
        <Text style={styles.meta}>
          {format(new Date(member.birthDate), "yyyy")}
          {member.deathDate ? ` - ${format(new Date(member.deathDate), "yyyy")}` : ""}
        </Text>
        {!!member.biography && <Text numberOfLines={2} style={styles.bio}>{member.biography}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(23, 32, 27, 0.10)"
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(121, 166, 111, 0.18)",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  content: {
    flex: 1
  },
  name: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "800"
  },
  meta: {
    marginTop: 3,
    color: colors.muted
  },
  bio: {
    marginTop: 6,
    color: colors.ink,
    opacity: 0.72
  }
});
