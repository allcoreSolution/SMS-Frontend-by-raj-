# Accountant Portal – School ERP (Offline Working)

Fully working offline React + Vite accountant module. All CRUD, Profile Settings, School Calendar, Fees, Income/Expense, Day Book use **localStorage** (no backend required).

## Login
- Email: `accountant@allcoresolution.com`
- Password: `admin@123`
- (Any non-empty email + password also works in offline demo mode)

## Run
```bash
npm install
npm run dev
```
Open the URL shown (usually http://localhost:5173).

## Working features
- **Login / Logout** – offline session
- **Dashboard** – live stats from local data + **real School Calendar** (add/delete events)
- **Fee Types / Fee Groups** – full Create / Read / Delete
- **Collect Fees / Search Due Fees** – list due students + collect (reduces due)
- **Income / Expense** – add via forms, list from local DB
- **Income Heads / Expense Heads** – full CRUD
- **Day Book** – filter by date, shows incomes + expenses + collections
- **Student List** – full CRUD + search
- **My Profile** – view + **Profile Settings** edit/save
- **Settings** – My Account, Notifications, **Reset All Data**

## Data
Stored in browser `localStorage` under keys `acc_*`.  
Settings → Reset All Data restores seed data.

## Stack
React 19, Vite 8, Tailwind 4, React Router 7, Lucide, Recharts, SweetAlert2
