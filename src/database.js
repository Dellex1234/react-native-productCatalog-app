import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const openDatabase = async () => {
    try {
        return await SQLite.openDatabase({ name: 'products.db', location: 'default' });
    } catch (error) {
        console.error("Error opening database:", error);
        throw error;
    }
};

export const initDatabase = async () => {
    const db = await openDatabase();
    await db.executeSql(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    )
  `);
};

export const createProductLocal = async (product) => {
    const db = await openDatabase();
    const { title, price, description, category, image } = product;
    await db.executeSql(
        `INSERT INTO products (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)`,
        [title, price, description, category, image]
    );
};

export const updateProductLocal = async (id, product) => {
    const db = await openDatabase();
    const { title, price, description, category, image } = product;
    await db.executeSql(
        `UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ? WHERE id = ?`,
        [title, price, description, category, image, id]
    );
};

export const getAllProductsLocal = async () => {
    const db = await openDatabase();
    const results = await db.executeSql(`SELECT * FROM products`);
    const items = [];
    results[0].rows.raw().forEach(row => items.push(row));
    return items;
};

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

export const saveProductsLocal = async (products) => {
    const db = await openDatabase();
    await db.executeSql(`DELETE FROM products`);
    const insertQuery = `INSERT INTO products (id, title, price, description, category, image) VALUES (?, ?, ?, ?, ?, ?)`;
    for (const product of products) {
        await db.executeSql(insertQuery, [
            product.id,
            product.title,
            product.price,
            product.description,
            product.category,
            product.image
        ]);
    }
};

export const markProductsAsSynced = async (productIds) => {
    const db = await openDatabase();
    const updateQuery = `UPDATE products SET synced = 1 WHERE id = ?`;

    for (const id of productIds) {
        await db.executeSql(updateQuery, [id]);
    }
};

export const markProductAsUnsynced = async (id) => {
    const db = await openDatabase();
    const updateQuery = `UPDATE products SET synced = 0 WHERE id = ?`;
    await db.executeSql(updateQuery, [id]);
};
