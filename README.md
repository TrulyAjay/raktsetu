# 🩸 RaktSetu — Real-Time Blood Donor Network

> Connecting blood seekers, donors, and blood banks across India in real-time.

![RaktSetu](https://img.shields.io/badge/RaktSetu-v1.0.0-DC3545?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge)

---

## 📋 Project Overview

RaktSetu is a web-based real-time blood donation platform with three user types:

- **🧑 Donors** — Register, toggle availability, receive notifications, track donation history
- **🆘 Seekers** — Post emergency blood requests, track status, find donors & banks
- **🏥 Blood Banks** — Manage inventory, verify donations, generate certificates, view analytics

---

## 🗂️ Folder Structure

```
/raktsetu
├── index.html                  # Landing page
├── donor-register.html         # Donor registration (2-step)
├── request-blood.html          # Post blood request
├── find-donors.html            # Search donors with smart matching
├── blood-banks.html            # Blood banks directory & inventory
├── donor-dashboard.html        # Donor portal
├── seeker-dashboard.html       # Seeker request tracker
│
├── bloodbank-portal/
│   ├── login.html              # Blood bank login
│   ├── dashboard.html          # Main dashboard with charts
│   ├── inventory.html          # Full inventory management
│   ├── requests.html           # All blood requests
│   ├── verify-donation.html    # Verify donation + certificate
│   └── analytics.html         # Analytics with export
│
├── css/
│   ├── main.css                # Design system, variables, utilities
│   ├── components.css          # Sidebar, tables, modals, inventory
│   └── bloodbank-portal.css    # Portal-specific styles
│
├── js/
│   ├── config.js               # Firebase config & app constants
│   ├── firebase-init.js        # Firebase initialization
│   ├── utils.js                # Smart matching, validation, helpers
│   ├── notifications.js        # FCM & in-app notifications
│   └── search-donors.js        # Donor search & matching module
│
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5, CSS3, JS ES6+ | Frontend |
| Bootstrap 5.3 (CDN) | UI framework |
| Firebase Firestore | Real-time database |
| Firebase Auth | Blood bank authentication |
| Firebase Storage | Certificate storage |
| Firebase Cloud Messaging | Push notifications |
| Chart.js 4.4 | Analytics charts |
| Google Fonts (Poppins + Inter) | Typography |

---

## 🚀 Setup Instructions

### 1. Clone / Download

```bash
git clone https://github.com/yourusername/raktsetu.git
cd raktsetu
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `raktsetu-blood-donation`
3. Set region to `asia-south1` (India)
4. Enable these services:
   - **Firestore Database** (Production mode)
   - **Authentication** → Enable Email/Password
   - **Storage**
   - **Cloud Messaging**

### 3. Configure Firebase

Open `js/config.js` and replace the placeholder values:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Get these values from: Firebase Console → Project Settings → Your Apps → Web App

### 4. Firestore Security Rules (Development)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Change these rules before production!**

### 5. Create Blood Bank Account

In Firebase Console → Authentication → Add user:
- Email: `admin@yourbloodbank.com`
- Password: your choice

Then add a document in Firestore `blood_banks` collection with matching email.

### 6. Run Locally

Since the project uses ES6 modules, you need a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using VS Code
Install "Live Server" extension → Right click index.html → Open with Live Server
```

Visit: `http://localhost:8000`

---

## 🧩 Key Features

### For Donors
- ✅ 2-step registration with blood group selector
- ✅ Availability toggle (live Firestore sync)
- ✅ Donation eligibility tracker (90-day rule)
- ✅ Badge & reward system (6 achievement badges)
- ✅ Live nearby requests feed
- ✅ Donation history with verified certificates

### For Seekers
- ✅ Emergency blood request with urgency levels (Critical/Urgent/Normal)
- ✅ Live active requests feed
- ✅ Request tracking with 4-step progress indicator
- ✅ Cancel/manage requests
- ✅ Quick links to donors and blood banks

### For Blood Banks
- ✅ Secure email/password login
- ✅ Real-time dashboard with Chart.js charts
- ✅ Full inventory management with stepper controls
- ✅ Live requests table with fulfill/close actions
- ✅ 3-step donation verification workflow
- ✅ Auto-generated printable donation certificates
- ✅ Analytics with 7/30/90 day periods + CSV export
- ✅ Donor leaderboard

### Smart Matching Algorithm
Donors are scored 0–100 based on:
- Blood group compatibility (required)
- Current availability
- Days since last donation (90-day eligibility)
- Total donation experience
- Location proximity
- Request urgency

---

## 🔮 Demo Mode

The app works without Firebase using built-in mock data:
- All pages render with sample donors, requests, blood banks
- Blood bank portal: use `demo@bloodbank.com` / `demo123`
- Donor dashboard: auto-loads demo donor profile

---

## 📊 Firestore Collections

| Collection | Purpose |
|---|---|
| `donors` | Registered donor profiles |
| `requests` | Blood requests from seekers |
| `blood_banks` | Blood bank profiles + inventory |
| `donations` | Verified donation records |
| `notifications` | In-app notification records |

---

## 🏆 Hackathon Notes

Built for hackathon MVP — optimized for:
- Live demo on browser
- All 3 user types covered
- Firebase real-time sync
- Smart matching algorithm
- Mobile responsive design
- Works with or without Firebase configured

---

## 📄 License

MIT License — Built with ❤️ to save lives across India.
