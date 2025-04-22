import axios from "axios";
import { openDatabase } from "../database";
const API_URL = "https://fakestoreapi.com/products";

// GET - Obtener productos
export const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        setError("Error al obtener productos. Intente de nuevo más tarde.");
        console.error("Error getting products:", error);
        return [];
    }
};

// POST - Crear producto
export const createProduct = async (newProduct) => {
    try {
        const response = await axios.post(API_URL, newProduct);
        if (response.data) {
            await saveProductLocal(response.data);
            await markProductAsSynced(response.data.id);
        }
        return response.data;
    } catch (error) {
        setError("Error al crear el producto. Intente de nuevo más tarde.");
        console.error("Error creating product:", error);
        return null;
    }
};

// PUT - Actualizar producto
export const updateProduct = async (id, product) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, product);
        console.log("Producto actualizado en la API:", response.data);
        return response.data;
    } catch (error) {
        setError(`Error al actualizar el producto con ID ${id}. Intente de nuevo.`);
        console.error(`Error updating product with ID ${id}:`, error);
        return null;
    }
};

// DELETE - Eliminar producto
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        setError(`Error al eliminar el producto con ID ${id}. Intente de nuevo.`);
        console.error(`Error deleting product with ID ${id}:`, error);
        return null;
    }
};

// Sincronizar productos no sincronizados
export const syncUnsyncedProducts = async () => {
    const unsyncedProducts = await getUnsyncedProducts();

    for (const product of unsyncedProducts) {
        const syncedProduct = await createProduct(product, () => { }, () => { });

        // Si el producto se sincronizó correctamente, marca como sincronizado
        if (syncedProduct) {
            await markProductAsSynced(syncedProduct.id);
        }
    }
};

// Función para guardar producto en la base de datos local
export const saveProductLocal = async (product) => {
    const db = await openDatabase();
    const { id, title, price, description, category, image } = product;

    await db.executeSql(
        `INSERT INTO products (id, title, price, description, category, image, synced) VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [id, title, price, description, category, image]
    );
};

// Función para marcar productos como sincronizados en la base de datos local
export const markProductAsSynced = async (id) => {
    const db = await openDatabase();
    await db.executeSql(`UPDATE products SET synced = 1 WHERE id = ?`, [id]);
};

// Función para obtener productos no sincronizados de la base de datos local
export const getUnsyncedProducts = async () => {
    const db = await openDatabase();
    const results = await db.executeSql(`SELECT * FROM products WHERE synced = 0`);
    const items = [];
    results[0].rows.raw().forEach(row => items.push(row));
    return items;
};

export const deleteProductLocal = async (id) => {
    const db = await openDatabase();
    await db.executeSql(`DELETE FROM products WHERE id = ?`, [id]);
};