import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { getProducts, deleteProduct } from "../api/productsApi";
import { getAllProductsLocal, saveProductsLocal, deleteProductLocal } from "../database";
import NetInfo from "@react-native-community/netinfo";
import { useThemeColor } from '../hooks/useThemeColor';
import { createStyles } from '../hooks/HomeScreen.styles';

export default function HomeScreen({ navigation, route }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const [isConnectedMessage, setConnectedMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);

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
            if(state.isConnected) setConnectedMessage("Conectado")
                 else setConnectedMessage ("No hay internet")
        });

        return () => unsubscribe();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const localProducts = await getAllProductsLocal();
    
            if (!isConnected) {
                setProducts(localProducts);
                return;
            }
    
            if (localProducts.length > 0) {
                setProducts(localProducts);
            } else {
                const apiProducts = await getProducts();
                await saveProductsLocal(apiProducts);
                setProducts(apiProducts);
            }
        } catch (error) {
            setError("Error al cargar los productos");
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar este producto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            if (isConnected) {
                                await deleteProduct(id);
                            } 
                            await deleteProductLocal(id);
                            const localProducts = await getAllProductsLocal();
                            setProducts(localProducts);
                        } catch (error) {
                            setError("Error al eliminar el producto.");
                            console.error("Error deleting product:", error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };
    
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (isMounted) {
                await loadProducts();
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [isConnected, route?.params?.refresh]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={[styles.buttonContainer, { marginTop: 10 }]}>
                <Button
                    title="Agregar Producto"
                    color={colors.success}
                    onPress={() => navigation.navigate("Agregar Producto")}
                />
            </View>
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={colors.tint} />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={products.slice().reverse()}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.category}>{item.category}</Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Editar"
                                    color={colors.primary}
                                    onPress={() => navigation.navigate("Editar Producto", { product: item })}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Eliminar"
                                    color={colors.danger}
                                    onPress={() => handleDeleteProduct(item.id)}
                                />
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}