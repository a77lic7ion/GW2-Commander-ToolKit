<div align="center">
  <img src="logo.png" alt="GW2 CommKit Logo" width="450">
  
# GW2 CommKit

### High-Fidelity Tactical Intelligence & Operational Command Suite
  
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Electron](https://img.shields.io/badge/Electron-Latest-47848F?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-Latest-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 🛰️ Operational Synopsis

**GW2 CommKit** is a professional-grade logistics, tactical planning, and intelligence platform for **Guild Wars 2**. Designed for the modern Commander, it transforms raw API data into a high-fidelity "Dark Mode" dashboard, providing a unified command center for event tracking, daily operations, currency conversions, and asset management.

This application is built as a standalone **Electron** executable, ensuring seamless desktop integration and persistent background monitoring.

---

## 🧩 Core Operating Systems

### 1. ChronoSync Event Dashboard
*New in v2.0* - A visual-first tactical timeline for tracking World Bosses and Meta Events.
- **Visual Intelligence Timeline**: A sleek, 8-hour horizontal graph showing past, live, and upcoming events with pin-point precision.
- **Live Status Indicators**: Real-time "LIVE", "UPCOMING", and "SCHEDULED" badges with neon status dots.
- **Tactical Event List**: A unified, high-contrast list view with slim progress bars for active events.
- **Integrated Tools**: Quick access to copy Waypoints, set local reminders (bell), and favorite specific metas.

### 2. Daily Operations Checklist ("Dailies")
A comprehensive daily workflow manager to maximize efficiency.
- **Operational Readiness Bar**: A visual progress bar tracking your daily completion status.
- **One-Click Execution**: Integrated launchers for external automation scripts (`Daily PSNA`, `Master Diver`) via Electron.
- **Efficient Parking Intel**: A dedicated, icon-rich table listing high-value character parking spots (e.g., *Large Chest of Essence*, *Wyvern Matriarch*, *Flax Farms*) with profit estimates and requirements.

### 3. Tactical Logistics (Conversions)
Maximize the value of your currencies with real-time conversion intelligence.
- **Laurel & Volatile Magic Vectors**: Dedicated cards for converting specialized currencies into gold.
- **Visual Profit Calculation**: Cards display clear profit-per-unit metrics, cost breakdowns, and return-on-investment indicators.
- **Premium UI**: Designed with a "List & Data" aesthetic similar to high-end financial dashboards.

### 4. Autonomous Farm Tracker
Engineered for long-term operations with background persistence.
- **Persistent Monitoring**: Runs continuously to track Gold, Material, and Item gains.
- **Live Intelligence Log**: Real-time feed of drops with integrated item iconography.
- **Session Export**: Generate CSV reports of your farming sessions for external analysis.

### 5. Tactical Wizard's Vault
A high-density objective table designed for rapid daily completion.
- **Integrated Intel**: Waypoints and "Easy Way" notes for common objectives.
- **Persistent Filter Vectors**: Toggle between PvE, PvP, and WvW filters; settings persist across sessions.
- **Special Operations**: Full tracking for Seasonal and Special objectives.

### 6. Integrated Wallet & Assets
High-visibility layout for managing your Tyrian treasury.
- **Tabulated Currencies**: Major currencies displayed side-by-side with large, readable typography.
- **Asset Reserve**: Collapsible groups for Materials, Bank items, and Character inventories.

---

## 🎨 Visual Identity

GW2 CommKit follows a strict **"Tactical Dark"** design language:
- **Palette**: `Slate-950` backgrounds, `Indigo-500` primary accents, with functional `Green` (Live/Profit) and `Amber` (Warning/Soon) indicators.
- **Typography**: Heavy usage of **Intl/Inter** and **Monospace** fonts for data precision.
- **UX**: Glassmorphism, subtle micro-animations, and hover effects to provide immediate feedback.

---

## 🚀 Installation & Deployment

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### 1. Repository Setup
```bash
git clone https://github.com/your-repo/gw2-commkit2.git
cd gw2-commkit2
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Development Mode
Run the application in the Electron development environment (supports Hot Module Replacement):
```bash
npm run electron:dev
```

### 4. Build for Production
Generate a production executable for your OS (Windows .exe):
```bash
npm run electron:build
```
*Executables will be generated in the `dist/` directory.*

---

## 🏗️ Technology Stack

- **Frontend**: React 18 / TypeScript
- **Styling**: Tailwind CSS (with custom tactical configurations)
- **Runtime**: Electron (Main process handles shell execution for batch scripts)
- **Bundler**: Vite
- **Data Persistence**: LocalStorage & File System (via Electron IPC)
- **API**: Guild Wars 2 Public API v2

---

## ⚖️ Credits & Legal

**Commander Cantlie #Affliction.5301**
*Architect & Lead Developer*

This application is not affiliated with ArenaNet or NCSOFT. All Guild Wars 2 assets, names, and data are the property of ArenaNet. Event sequence logic adapted from open-source community intelligence.
