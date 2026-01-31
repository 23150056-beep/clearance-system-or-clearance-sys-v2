# Clearance System - Expo/React Native Version

This is the React Native (Expo) version of the Clearance System app.

## 🚀 How to Run on Snack Expo

### Option 1: Use Snack Expo (Easiest - No Installation)

1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Create a new Snack
3. Copy the contents of each file into Snack:
   - `App.js` → Main App.js
   - `context/DataContext.js` → Create folder and file
   - `screens/LandingScreen.js` → Create folder and file
   - `screens/StudentDashboard.js`
   - `screens/StaffDashboard.js`
   - `screens/AdminDashboard.js`
4. Add these dependencies in Snack:
   - `@react-navigation/native`
   - `@react-navigation/native-stack`
   - `expo-image-picker`
5. Run on iOS/Android simulator or scan QR with Expo Go app

### Option 2: Run Locally

```bash
# Navigate to this folder
cd clearance-expo

# Install dependencies
npm install

# Start Expo
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan QR code with Expo Go app on your phone

## 📱 Demo Credentials

### Student
- **ID:** STU-2024-001
- **Password:** password123

### Staff
- **Email:** ana.garcia@university.edu
- **Password:** staff123

### Admin
- **Email:** admin@university.edu
- **Password:** admin123

## 📁 Project Structure

```
clearance-expo/
├── App.js                 # Main entry point with navigation
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── context/
│   └── DataContext.js     # State management
└── screens/
    ├── LandingScreen.js   # Login & Registration
    ├── StudentDashboard.js # Student view
    ├── StaffDashboard.js   # Staff review
    └── AdminDashboard.js   # Admin overview
```

## ✨ Features

- ✅ Student Registration & Login
- ✅ Role-based authentication (Student/Staff/Admin)
- ✅ Document upload with camera/gallery
- ✅ Staff review and approval workflow
- ✅ Admin dashboard with statistics
- ✅ Dark theme UI
- ✅ Native mobile experience

## 🔧 Dependencies

- React Navigation (native-stack)
- Expo Image Picker
- Expo Vector Icons
- React Native Safe Area Context
