// ── RaktSetu Firebase Initialization ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth — used for Phone OTP + Blood Bank email login
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Offline persistence (best-effort)
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence: not supported in this browser');
  }
});

export default app;
