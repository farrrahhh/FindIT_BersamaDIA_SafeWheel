# 🦽 SafeWheel

SafeWheel is a smart health monitoring and alert system designed for wheelchair users and their guardians. It combines a React Native mobile application, an IoT device using ESP32, and a backend API to provide real-time health tracking and fall detection.

## 📁 Project Structure
├── backend              # Express.js backend (Prisma, Vercel deployed)
├── iot                  # ESP32 code (MPU6050, MAX30100, GPS)
├── safe-wheel           # React Native (Expo) app

## 🚀 Features

### 📱 Mobile App (`safe-wheel`)
- User role selection: Wheelchair user or Guardian
- Signup/Login for both roles
- Realtime health chart (Heart Rate, Oxygen Level)
- Fall detection notifications for guardians
- Guardian maps location of wheelchair user
- Location update fallback if GPS fails

### 🌐 Backend (`backend`)
- REST API built with Express.js
- Prisma ORM (MySQL + Railway deployment)
- Endpoints:
   - `POST /api/signup`
  - `POST /api/signup/guardian`
  - `POST /api/login`
  - `GET /api/user`
  - `PUT /api/user`
  - `POST /api/user_alert_notification`
  - `GET /api/user_alert_notification`
  - `POST /api/expo-token`
  - `GET /api/user/safewheel_name`
  - `POST /api/health_item`
  - `GET /api/health_item`
  - `GET /api/health_item/all`
  - `PUT /api/user_location`
  - `GET /api/user_location`

### 🔧 IoT (`iot`)
- ESP32 reads:
  - Pulse Oximeter (MAX30100)
  - Accelerometer/Gyroscope (MPU6050)
  - GPS module (fallback to app if unavailable)
- Detects fall via pitch/roll threshold
- Sends data to API every 3 seconds
- Alerts sent on fall detection

## 🛠️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/yourusername/safewheel.git
cd safewheel
```

### 2. Run Mobile App
```bash
cd safe-wheel
npm install
npx expo start
```

### 3. Flash IoT Firmware
- Use PlatformIO or Arduino IDE.
- Connect ESP32 and flash code from `/iot`.

## 📡 API Deployment
- Hosted on: Vercel
- API URL: https://find-it-bersama-dia-safe-wheel.vercel.app/api/...

## 🧠 Tech Stack
- Frontend: React Native (Expo), TypeScript
- Backend: Node.js, Express, Prisma ORM, Railway
- Database: MySQL
- IoT: ESP32, MAX30100, MPU6050, GPS module
- Hosting: Vercel + Railway
