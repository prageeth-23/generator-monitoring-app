# ⚡ GenyTracer – IoT Generator Monitoring System

> Real-time generator health monitoring powered by ESP32, Firebase & React.js — monitor fuel, voltage, current, and vibration from anywhere.

---

## 📱 App Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/e16f2a10-6342-44ff-bae9-9f8fdf3e317f" width="200" alt="Login Page"/>
  <img src="https://github.com/user-attachments/assets/cbd0200e-7be9-4386-9de6-3a63013e6014" width="200" alt="Sign Up Page"/>
  <img src="https://github.com/user-attachments/assets/7aac7d03-b0f0-4fd9-95e6-117f88d77859" width="200" alt="Dashboard"/>
  <img src="https://github.com/user-attachments/assets/d40965a4-6bb9-4f94-b9ea-98b5a0d7ed45" width="200" alt="Sensors"/>
  <img src="https://github.com/user-attachments/assets/5dff9c99-77f8-4e5f-997f-132985186ee0" width="200" alt="Analytics"/>
</p>

---

## 📖 Overview

**GenyTracer** is a full-stack IoT solution that transforms traditional generators into smart, remotely monitored power systems. It continuously tracks critical generator parameters and delivers real-time alerts directly to your phone — eliminating manual inspections and preventing unexpected failures.

Built as part of the **BSc (Hons) Computer Science** programme at **Plymouth University (PUSL2022 – Introduction to IoT)**.

---

## 🎯 Key Features

- 🔋 **Fuel Level Monitoring** — Ultrasonic sensor tracks tank level with auto-alerts at critical thresholds
- ⚡ **Voltage Monitoring** — Real-time AC voltage tracking with over/under voltage alerts
- 🔌 **Current & Power Monitoring** — Live current draw and calculated power output
- 📳 **Vibration Detection** — 3-axis accelerometer detects mechanical faults and imbalance
- ☁️ **Firebase Real-Time Sync** — Data transmitted from ESP32 to cloud in under 1.5 seconds
- 🚨 **Smart Alert System** — Severity-based alerts (Critical / Warning / Info) with buzzer activation
- 📊 **Analytics Dashboard** — 24h/48h historical trend charts for all parameters
- 🔐 **Secure Authentication** — Firebase Auth with SSL/TLS encrypted data transmission

---

## 🏗️ System Architecture

```
Generator
    │
    ▼
[Sensors]
 JSN-SR04T (Fuel)
 ZMPT101B  (Voltage)
 SCT-013   (Current)
 ADXL345   (Vibration)
    │
    ▼
[ESP32 Microcontroller]
 • Data acquisition & processing
 • RMS calculation & noise filtering
 • Wi-Fi transmission
    │
    ▼ (Wi-Fi / SSL)
[Firebase Realtime Database]
 • Live sensor data storage
 • Historical data retention
 • Secure read/write rules
    │
    ▼
[GenyTracer Mobile App]
 • Real-time dashboard
 • Trend charts & analytics
 • Alert management
 • Remote monitoring
```

---

## 🔧 Hardware Components

| Component | Model | Purpose |
|-----------|-------|---------|
| Microcontroller | ESP32 Dev Board | Central processing + Wi-Fi |
| Fuel Sensor | JSN-SR04T Ultrasonic | Tank level measurement |
| Voltage Sensor | ZMPT101B | AC voltage monitoring |
| Current Sensor | SCT-013-000 (100A) | Non-invasive current measurement |
| Vibration Sensor | ADXL345 Accelerometer | 3-axis vibration detection |
| Actuators | Buzzer + Red LED | On-site critical alerts |

---

## 💻 Software Stack

| Layer | Technology |
|-------|-----------|
| Firmware | Arduino IDE (C / C++) |
| Cloud Database | Firebase Realtime Database |
| Authentication | Firebase Auth |
| Mobile Frontend | React.js + Capacitor |
| Mobile Build | Android (APK) |

---

## 📊 Test Results

| Test ID | Sensor | Result | Status |
|---------|--------|--------|--------|
| TC-HW-01 | Fuel Level (JSN-SR04T) | 81.7% at 24.5cm — accurate | ✅ Pass |
| TC-HW-02 | AC Voltage (ZMPT101B) | 217V with ±1% error margin | ✅ Pass |
| TC-HW-03 | Current (SCT-013) | 8.1A stable reading | ✅ Pass |
| TC-HW-04 | Vibration (ADXL345) | 1.9g real-time recording | ✅ Pass |
| TC-HW-05 | Alert System | Critical alert at <15% fuel | ✅ Pass |
| TC-HW-06 | Cloud Connectivity | Avg latency: **1.5 seconds** | ✅ Pass |

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Android Studio (for APK build)
- Firebase project setup

### Installation

```bash
# Clone the repository
git clone https://github.com/prageeth-23/generator-monitoring-app.git

# Navigate to project
cd generator-monitoring-app

# Install dependencies
npm install

# Run in browser
npm run dev

# Build for Android
npx cap sync android
npx cap open android
```

### Firebase Setup
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Realtime Database** and **Authentication**
3. Copy your Firebase config into `src/lib/firebase.ts`
4. Set database rules for authenticated access only

### ESP32 Firmware
- Open `GenyTracer_Node_Final.ino` in Arduino IDE
- Install required libraries: `FirebaseESP32`, `ADXL345`, `Wire`
- Add your Wi-Fi credentials and Firebase URL
- Flash to ESP32

---

## 🔮 Future Scope

- [ ] Remote generator ON/OFF control via industrial relays
- [ ] AI/ML predictive maintenance using historical vibration & current data
- [ ] Automated SMS/Email alerts via Firebase Cloud Functions
- [ ] Multi-generator dashboard for monitoring multiple sites

---

## 👨‍💻 Developer

**Selladurai Prageeth** — Mobile App Frontend Developer  
Designed and built the complete GenyTracer React.js mobile application including the real-time sensor dashboard, system status indicators, historical data chart views, navigation drawer and screen transitions.

- 🔗 GitHub: [@prageeth-23](https://github.com/prageeth-23)

---

## 🎓 Academic Context

- **Module:** PUSL2022 – Introduction to IoT
- **Programme:** BSc (Hons) Computer Science
- **University:** Plymouth University (In Partnership)
- **Team:** Group R

---

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ using ESP32, Firebase & React.js*
