# SuperAdmin Dashboard - FIXED

## Login (same as all panels)
- Email: admin123@gmail.com
- Password: admin@123
- API: http://localhost:5050/api

## What was fixed
1. AuthContext used port 5000 -> now 5050
2. Login sends email + username for backend compatibility
3. API services aligned with backend routes:
   - /api/tenant/* (schools CRUD)
   - /api/plans/* (plans CRUD)
   - /api/settings/*
   - /api/superadmin/*
4. Missing routes: /knowledge-base/articles, /knowledge-base/categories
5. .env cleaned (no BOM)

## Run
```powershell
# Terminal 1 - Backend
cd School_ERP_Api's
node reset_admin.js
npm run dev

# Terminal 2 - SuperAdmin
cd SuperAdmin_Dashboard
npm install
npm run dev
```

Open http://localhost:5173/login
