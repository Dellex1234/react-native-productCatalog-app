import { StyleSheet } from 'react-native';

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
      padding: 10,
      backgroundColor: colors.background,
    },
    itemContainer: {
      marginBottom: 15,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.background,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    title: {
      fontWeight: 'bold',
      color: colors.title,
      fontSize: 18,
      marginBottom: 5,
    },
    price: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    description: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    category: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    errorText: {
      color: colors.danger,
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 20,
    },
    buttonContainer: {
      marginBottom: 10,
    },
    button: {
      marginBottom: 10,
    },
    actionButton: {
      marginVertical: 5,
      paddingVertical: 12,
      borderRadius: 8,
    },
  });
