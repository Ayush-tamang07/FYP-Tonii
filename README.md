# Tonii - Fitness Application

Tonii is a full-stack fitness application that empowers users with personalized workout plans, intelligent workout suggestions, calorie tracking, form correction feedback, and consistency through streak tracking.

---

## ✨ Features

- 🏋️ Custom Workout Plan  
- 💡 Workout Suggestion  
- 🔥 Calorie Calculation  
- 📆 Streak Tracker  

---

## 🧰 Tech Stack

- **Frontend (User App)**: React Native (Expo)  
- **Frontend (Admin Panel)**: React.js  
- **Backend**: Node.js (Express)  
- **Database**: MySQL  
- **AI Module**: Python (Flask, for posture correction)  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush-tamang07/FYP-Tonii.git
cd tonii
```

### 2. install dependecies
```bash
# Admin Panel
cd admin
npm i

# Backend
cd ../backend
npm i

# Mobile App
cd ../tonii
npm i
```
### 3.  setup dotenv file
- DATABASE_URL="mysql://<username>:<password>@localhost:3306/<database>"
- PORT=<your_port>
- JWT_SECRET="<your_jwt_secret>"
- EMAIL_USER="<your_email>"
- EMAIL_PASS="<your_email_password_or_app_key>"
- CLOUDINARY_NAME="<your_cloudinary_cloud_name>"
- CLOUDINARY_API_KEY="<your_cloudinary_api_key>"
-CLOUDINARY_API_SERECT="<your_cloudinary_api_secret>"

### 4.  To run project
```bash
cd tonii
npx expo start

cd backend
npm start

cd admin
npm run dev

cd server
python app.py
```
