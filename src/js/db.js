//palette-pilot\src\js\db.js
import { openDB } from "idb";

const DB_NAME = 'palettePilotDB';
const DB_VERSION = 1;
const STORE_NAME = 'previews';

async function initDB() {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME);
        },
    });
    return db;
}

export async function saveImageToDB(imageBlob) {
    const db = await initDB();

    await db.put(STORE_NAME, imageBlob, 'last-preview');
}

export async function loadImageFromDB() {
    const db = await initDB();

    return await db.get(STORE_NAME, 'last-preview');
}

export async function deleteImageFromDB() {
    const db = await initDB();

    await db.delete(STORE_NAME, 'last-preview');
}