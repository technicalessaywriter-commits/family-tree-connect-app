import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { colors } from "../theme";

export function TextField(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(23, 32, 27, 0.16)",
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16
  }
});
