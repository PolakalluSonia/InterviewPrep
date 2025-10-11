import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ✅ Initialize Firebase Admin SDK safely
function initFirebaseAdmin() {
    const apps = getApps();

    if (!apps.length) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Important: replace newlines properly in the private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        });
        console.log("✅ Firebase Admin initialized");
    }

    // ✅ return on the same line — no line break bug!
    return {
        auth: getAuth(),
        db: getFirestore(),
    };
}

export const { auth, db } = initFirebaseAdmin();
