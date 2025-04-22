import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { createProduct, updateProduct } from "../api/productsApi";
import { createProductLocal, updateProductLocal } from "../database";
import NetInfo from "@react-native-community/netinfo";
import { useThemeColor } from '../hooks/useThemeColor';
import { createStyles } from '../hooks/FormScreen.styles';

export default function FormScreen({ route, navigation }) {
    const product = route.params?.product;
    const [title, setTitle] = useState(product?.title || "");
    const [price, setPrice] = useState(product?.price?.toString() || "");
    const [description, setDescription] = useState(product?.description || "");
    const [category, setCategory] = useState(product?.category || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isConnected, setIsConnected] = useState(true);

    const colors = {
        text: useThemeColor({}, 'text'),
        title: useThemeColor({}, 'title'),
        danger: useThemeColor({}, 'danger'),
        success: useThemeColor({}, 'success'),
        primary: useThemeColor({}, 'primary'),
        background: useThemeColor({}, 'background'),
    };

    const styles = createStyles(colors);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateProduct = async () => {
        setError("");

        if (!title.trim() || !price.trim() || !description.trim() || !category.trim()) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        const data = {
            title,
            price: parseFloat(price),
            description,
            image: "https://i.pravatar.cc",
            category,
        };

        setLoading(true);

        try {
            if (isConnected) {
                await createProduct(data);
            } else {
                await createProductLocal(data);
            }

            console.log("Producto creado");
            navigation.navigate("Productos", { refresh: true });
        } catch (err) {
            console.error("Error creando producto:", err);
            setError("Ocurrió un error al crear el producto.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async () => {
        setError("");

        if (!title.trim() || !price.trim() || !description.trim() || !category.trim()) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        const data = {
            title,
            price: parseFloat(price),
            description,
            image: "https://i.pravatar.cc",
            category,
        };

        setLoading(true);

        try {
            if (isConnected) {
                await updateProduct(product.id, data);
            }
            await updateProductLocal(product.id, data);
            console.log("Producto actualizado");
            navigation.navigate("Productos", { refresh: true });
        } catch (err) {
            console.error("Error actualizando producto:", err);
            setError("Ocurrió un error al actualizar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'black' }}
            behavior={Platform.OS === 'android' ? 'height' : 'padding'} 
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={[styles.scroll, { padding: 20}]} keyboardShouldPersistTaps="handled">
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text style={styles.label}>Producto:</Text>
                <TextInput
                    style={[styles.input, { height: 75, textAlignVertical: 'top' }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor={colors.placeholder}
                    placeholder="Ingrese nombre del producto"
                    multiline={true}
                    numberOfLines={3}
                />

                <Text style={styles.label}>Precio:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    placeholderTextColor={colors.placeholder}
                    placeholder="Ingrese precio"
                />

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                    style={[styles.input, { height: 200, textAlignVertical: 'top' }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor={colors.placeholder}
                    placeholder="Ingrese una descripción del producto"
                    multiline={true}
                    numberOfLines={10}
                />

                <Text style={styles.label}>Categoría:</Text>
                <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholderTextColor={colors.placeholder}
                    placeholder="Ingrese la categoría del producto"
                />

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <View style={styles.button}>
                        <Button
                            title={product ? "Actualizar" : "Crear"}
                            onPress={product ? handleUpdateProduct : handleCreateProduct}
                            color={product ? colors.primary : colors.success}
                        />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView >
    );
}