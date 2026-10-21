SuperAdmin Dashboard - ALL FIXES APPLIED
========================================

LOGIN: admin123@gmail.com / admin@123
API: http://localhost:5050/api

FIXED:
1. AuthContext - port 5050 + email/username login
2. Header - Settings goes to /settings-center (no more 404)
3. Header - Language dropdown works (saves to localStorage)
4. Team - modal outside (typing focus OK), phone max 10 digits, real CRUD API
5. Plan Add-ons - controlled inputs, full CRUD
6. Templates - create/list/delete works, typing visible
7. Blog Posts - demo mode removed, New Post modal CRUD
8. Blog Categories - demo mode removed
9. Sitemap - demo mode removed, inputs work
10. Visual Builder - demo mode removed
11. Landing Page - Publish saves
12. Onboarding Templates - showAddTemplate state fixed
13. Attendance Trends - sample data
14. Settings routes redirects
15. API services aligned to backend

HOW TO USE:
1. Extract this folder as SuperAdmin_Dashboard (or replace src/ files)
2. Create .env with: VITE_API_URL=http://localhost:5050/api
3. Backend must run on port 5050
4. npm install && npm run dev
5. Login at http://localhost:5173/login

BACKEND (also update if Team CRUD needed):
- controllers/superAdminController.js (role ObjectId + username)
- routes/superAdminRoutes.js (PUT/DELETE /team/:id)


=== ROUND 2 FIXES ===
1. Schools Usage page - blank screen fixed (school.planIcon was undefined). Filters (status/plan/expiry) now work, Reset works.
2. Fee Collections page - blank screen fixed (amount.replace on a number). Mode Clustering now calculated from real data.
3. ALL inputs/search boxes - typed text was invisible (white text on white bg because of Tailwind preflight + body colour).
   Fixed globally in src/index.css (input/textarea/select get dark text + visible placeholder).
4. Typing losing focus after every key - nested components moved out of render:
   MasterMenus (ModalForm), Blog (PostForm), KnowledgeBase (ArticleModal), Schools (InputField),
   AppearanceSettings (ToggleSwitch, ColorPickerField), CommsWalletSettings (Field).
5. Language change now really works: src/i18n/ (LanguageContext + translations).
   Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali. Header dropdown + Settings > General > Default Language both use it.
   Choice is saved in localStorage (sa_language). Strings not in src/i18n/translations.js stay English - add a line there to translate more.
6. Links: added routes /reports, /blog, /comms-wallet (were 404). Header quick-search fixed.
   Sidebar now links every page (Billing & Gateways, Admin Tools, Cron Monitor, Infrastructure, extra Settings, Reports, etc).
   Sidebar profile/logout no longer reload the page.
7. BlogPosts.jsx - JSX syntax error fixed (build was failing). WalletOversight - openModal undefined fixed.
8. API list responses handled safely everywhere via src/utils/helpers.js (toArray).
