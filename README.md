# School ERP (by RAJ)

Multi-panel School ERP system with unified backend APIs.

## Admin Login (ALL panels)
- **Email:** admin123@gmail.com
- **Password:** admin@123

## Structure
- School_ERP_Api's - Node.js + Express + MongoDB Backend (Port 5050)
- School_ERP - Main School Admin Panel (React + Vite)
- SuperAdmin_Dashboard - Platform Super Admin
- Branch-Admin - Branch Admin panel
- Accountant - Accountant panel
- Teacher Panel - Teacher panel
- Student & Parents - Student & Parents panel
- Multi School Erp - Multi-school management
- app - Flutter mobile app

See SETUP.md for full setup instructions.

## Quick Start
```bash
# Terminal 1 - Backend
cd "School_ERP_Api's"
npm install
node seed_admin.js
node server.js

# Terminal 2 - School Admin
cd School_ERP
npm install
npm run dev
```

Open browser and login with admin123@gmail.com / admin@123
