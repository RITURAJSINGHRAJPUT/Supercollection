# 🚀 Super Collection - Complete Shop Management System

A fully responsive, multi-purpose shop management application built for **Super Collection**. This system is designed to provide dual-functionality:
1. **Customer Portal:** A sleek, mobile-first website for customers to browse digital products, physical items, and utilize **WhatsApp Ordering**.
2. **Admin Dashboard:** A robust backend system to manage products, categories, sales, purchases, and real-time analytics.

---

## 🌟 Key Features

### For Customers:
*   ✨ **Modern UI & Animations:** Clean glassmorphism design with an energetic primary brand color (`#FF6B00`).
*   📱 **Fully Mobile-Optimized:** Built from the ground up for the perfect smartphone browsing experience.
*   💬 **WhatsApp Direct Ordering:** "Order on WhatsApp" functionality instantly pre-fills the message and sends it directly to the store owner's WhatsApp API.

### For Admins:
*   🔐 **Secure Access:** Protected login interface built firmly on Firebase Auth.
*   📦 **Inventory Management:** Full Create, Read, Update, Delete (CRUD) operations for both Products and Categories via interactive modals. Automatically handles low-stock visualization.
*   🧾 **Sales & Purchases Register:** Easily record daily sales and purchases. Automatically maintains living inventory/stock counts via real-time data binding.
*   📊 **Analytics & Reporting:** 
    *   Dynamic, interactive data visualizations built using **Recharts**.
    *   30-Day performance overview.
    *   Automated reporting on your TOP selling products and total profit calculations.
*   🖨️ **Advanced Data Controls:**
    *   **PDF Exports:** Capture and download exact replications of the analytics Dashboard natively as PDF.
    *   **Data Backup:** Support for native `JSON` exports covering all database clusters and `CSV` extracts for core sales databases.
    *   **Reset Engine:** Built-in tools for safely and cleanly wiping transactional records.

---

## 🧠 Tech Stack
*   **Frontend Framework:** React 18, TypeScript, Vite
*   **Routing:** React Router v6
*   **Styling:** Tailwind CSS (v3 with custom configuration for tokens & animations)
*   **Database & Auth:** Google Firebase (Cloud Firestore & Authentication)
*   **Icons & Charts:** Lucide React & Recharts
*   **Export Modules:** jsPDF + html2canvas

---

## 🛠️ Local Development & Setup

### Prerequisites
*   Node.js (`v18+` recommended)
*   A Firebase web project configured on the [Firebase Console](https://console.firebase.google.com).

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/supercollection.git
cd supercollection

# Install all dependencies
npm install
```

### 2. Configure Environment Variables

Create `.env` file from the provided `.env.template` in the root of the project:

```env
# /supercollection/.env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_WHATSAPP_NUMBER=919999999999
```

*(Note: Never commit your `.env` content if your repo is public. Replace `VITE_WHATSAPP_NUMBER` with your exact contact number).*

### 3. Launch Development Server

```bash
# Boot the dev server instantly using Vite
npm run dev
```

Visit `http://localhost:5173` to explore the site!

---

## 🏭 Application Structure

```text
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Modals, Buttons, Inputs
│   │   ├── analytics/   # Recharts metric panels
│   │   ├── layout/      # Navbar, Sidebar, Footer
│   │   └── product/     # Cards and Category List grids
│   ├── config/          # Central API wrappers
│   ├── context/         # AuthProvider & App states
│   ├── hooks/           # Firebase real-time custom hooks (e.g. useProducts)
│   ├── pages/
│   │   ├── admin/       # Protected business dashboards
│   │   ├── auth/        # Firebase login handler
│   │   └── public/      # Landing grids & storefront
│   ├── routes/          # Standard and protected router rules
│   ├── services/        # Firebase native CRUD executions
│   ├── styles/          # Tailwind setup and generic scopes
│   ├── types/           # Rigid TS definitions for all App logic
│   └── utils/           # Data & Currency formatters, File Export engines
└── .env                 # API key references
```

---

## 📜 License
Private Software. Copyright 2026 by Super Collection. All Rights Reserved.
