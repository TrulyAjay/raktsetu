// ── RaktSetu Firebase Configuration ──
// Replace these values with your actual Firebase project config
// Get from: Firebase Console > Project Settings > Your apps > Firebase SDK snippet

export const firebaseConfig = {
  apiKey: "AIzaSyAhN24ro4K7wdspHJXmYGuGVKvRMpvKZS4",
  authDomain: "raktsetu-v2.firebaseapp.com",
  projectId: "raktsetu-v2",
  storageBucket: "raktsetu-v2.firebasestorage.app",
  messagingSenderId: "366342194937",
  appId: "1:366342194937:web:58d980f34a71598fb94428"
};

// App constants
export const APP_CONFIG = {
  name: "RaktSetu",
  tagline: "Real-Time Blood Donor Network",
  version: "1.0.0",
  bloodGroups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  urgencyLevels: ["CRITICAL", "URGENT", "NORMAL"],
  requestStatuses: ["ACTIVE", "FULFILLED", "CLOSED", "CANCELLED"],
  maxDonationGapDays: 90, // Min days between donations
  defaultSearchRadiusKm: 50,
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
};