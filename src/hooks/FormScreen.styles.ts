// FormScreen.styles.ts
import { StyleSheet } from "react-native";

export const createStyles = (colors: {
  text: string;
  title: string;
  danger: string;
  success: string;
  primary: string;
  background: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    label: {
      fontSize: 16,
      color: colors.title,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      borderRadius: 8,
      marginBottom: 15,
      color: colors.text,
    },
    errorText: {
      color: colors.danger,
      textAlign: "center",
      marginBottom: 10,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: 20,
    },
    button: {
      marginTop: 10,
    },
  });
