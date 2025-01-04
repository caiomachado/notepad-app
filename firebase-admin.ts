import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

if (getApps().length === 0) {
    app = initializeApp({
        credential: cert(JSON.parse(`${process.env.FIREBASE_ADMIN_CONFIG}`)),
    });
} else {
    app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };