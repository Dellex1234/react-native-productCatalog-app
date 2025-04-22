import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDatabase } from './src/database';
import HomeScreen from "./src/screens/HomeScreen";
import FormScreen from "./src/screens/FormScreen";

const Stack = createNativeStackNavigator();

export default function App() {

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                await initDatabase();
                console.log("Base de datos inicializada correctamente");
            } catch (error) {
                console.error("Error al inicializar la base de datos:", error);
            }
        };

        setupDatabase();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Productos">
                <Stack.Screen name="Productos" component={HomeScreen} options={{
                    headerTitleAlign: 'center'
                }} />
                <Stack.Screen name="Editar Producto" component={FormScreen} options={{
                    headerTitleAlign: 'center'
                }} />
                <Stack.Screen name="Agregar Producto" component={FormScreen} options={{
                    headerTitleAlign: 'center'
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
