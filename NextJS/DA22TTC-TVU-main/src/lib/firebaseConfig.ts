import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

let databasePromise: Promise<any>;

function initializeFirebase() {
    if (!databasePromise) {
        databasePromise = fetch('/api/firebase-config')
            .then(response => response.json())
            .then(firebaseConfig => {
                const app = initializeApp(firebaseConfig);
                return getDatabase(app);
            });
    }
    return databasePromise;
}

export async function getDatabaseInstance() {
    if (!databasePromise) {
        await initializeFirebase();
    }
    return databasePromise;
}