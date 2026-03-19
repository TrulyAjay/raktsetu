// ── RaktSetu Notifications Module ──
import { db, messaging } from './firebase-init.js';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

const VAPID_KEY = "YOUR_VAPID_KEY_HERE"; // Replace with your Firebase VAPID key

// ── Request browser notification permission ──
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  try {
    if (!messaging) return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.warn("FCM token error:", err.message);
    return null;
  }
}

// ── Save FCM token to donor profile ──
export async function saveFCMToken(donorId, token) {
  if (!donorId || !token) return;
  try {
    await updateDoc(doc(db, 'donors', donorId), { fcm_token: token, updated_at: serverTimestamp() });
  } catch (err) {
    console.warn("Failed to save FCM token:", err.message);
  }
}

// ── Listen for foreground messages ──
export function listenForMessages(callback) {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    if (callback) callback(payload);
  });
}

// ── Create in-app notification in Firestore ──
export async function createNotification({ recipientId, recipientType, title, message, type, requestId = null }) {
  try {
    await addDoc(collection(db, 'notifications'), {
      recipient_id: recipientId,
      recipient_type: recipientType, // 'donor' | 'blood_bank' | 'seeker'
      title,
      message,
      type, // 'BLOOD_REQUEST' | 'DONATION_VERIFIED' | 'REQUEST_FULFILLED' | 'GENERAL'
      request_id: requestId,
      read: false,
      created_at: serverTimestamp()
    });
  } catch (err) {
    console.error("Notification create error:", err.message);
  }
}

// ── Mark notification as read ──
export async function markNotificationRead(notifId) {
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  } catch (err) {
    console.error("Mark read error:", err.message);
  }
}

// ── Listen to unread notifications for a recipient ──
export function listenToNotifications(recipientId, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('recipient_id', '==', recipientId),
    where('read', '==', false),
    orderBy('created_at', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (callback) callback(notifs);
  });
}

// ── Show browser notification ──
export function showBrowserNotification(title, body, icon = '/assets/icons/icon-192.png') {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon });
  }
}

// ── Notify nearby donors about a new blood request ──
export async function notifyDonorsAboutRequest(request) {
  // In production: use Cloud Functions to find donors by location + blood group
  // Here we create a notification record that donors will pick up
  console.log("Notifying donors about request:", request.request_id);
  await createNotification({
    recipientId: 'broadcast_' + request.blood_group_needed,
    recipientType: 'donor',
    title: `🆘 ${request.urgency_level}: ${request.blood_group_needed} Blood Needed`,
    message: `${request.units_needed} unit(s) needed at ${request.hospital_name}. Contact: ${request.seeker_phone}`,
    type: 'BLOOD_REQUEST',
    requestId: request.request_id
  });
}
