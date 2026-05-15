import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false
}: {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        (pressed || disabled) && styles.pressed
      ]}
    >
      <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(23, 32, 27, 0.14)"
  },
  danger: {
    backgroundColor: colors.clay
  },
  pressed: {
    opacity: 0.7
  },
  label: {
    color: colors.white,
    fontWeight: "700"
  },
  secondaryLabel: {
    color: colors.ink
  }
});
