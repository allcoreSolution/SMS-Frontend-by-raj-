# School ERP - Setup Guide (by RAJ)

## Unified Admin Credentials (ALL panels)
- **Email:** admin123@gmail.com
- **Password:** admin@123

## Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017
- npm

## 1. Backend API
```bash
cd "School_ERP_Api's"
npm install
# Make sure MongoDB is running
node seed_admin.js          # creates admin123@gmail.com / admin@123
node seed_superadmin.js     # same credentials for SuperAdmin
node server.js              # or: npm start   → runs on port 5050
```

API Base: http://localhost:5050/api

## 2. School Admin Panel (School_ERP)
```bash
cd School_ERP
npm install
npm run dev                 # usually http://localhost:5173
```
Login: admin123@gmail.com / admin@123

## 3. SuperAdmin Dashboard
```bash
cd SuperAdmin_Dashboard
npm install
npm run dev
```
Login: admin123@gmail.com / admin@123

## 4. Other panels (Branch-Admin, Accountant, Teacher, Student & Parents)
Same pattern:
```bash
cd "<panel-folder>"
npm install
# Ensure VITE_API_URL=http://localhost:5050/api in .env
npm run dev
```

## 5. Flutter App (app/)
```bash
cd app
flutter pub get
# Update API base URL to http://localhost:5050 if needed
flutter run
```

## Notes
- All "Allcore solutions" branding replaced with **RAJ YADAV**
- Git history / .git folders removed for clean push to your own GitHub
- node_modules not included — run `npm install` in each project
- Backend port is **5050** (not 5000)
