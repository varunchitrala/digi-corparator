# Digital Corporator & Smart Ward Management Platform

A production-ready multi-tenant SaaS application built for Municipal Corporations, Corporators, Ward Officers, and Citizens.

---

## Technical Architecture

- **Frontend**: React.js (Vite) + Tailwind CSS + Lucide React + Recharts + Leaflet OpenStreetMap
- **Backend**: Node.js + Express.js + REST API + MySQL (mysql2/promise)
- **Database**: MySQL 8.0 / MariaDB (XAMPP default configuration on `localhost:3306`)

---

## Quick Setup Instructions

### 1. Database Setup (XAMPP MySQL)
1. Start **Apache** and **MySQL** in XAMPP Control Panel.
2. Open phpMyAdmin (`http://localhost/phpmyadmin`) or MySQL CLI.
3. Import schema and demo seed data:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on: **`http://localhost:5000`**
Health Check: **`http://localhost:5000/api/health`**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **`http://localhost:5173`**

---

## Multi-Tenant Security & RBAC Scopes
Tenant isolation is enforced strictly at the database & backend level.
- **Tenant Hierarchy**: `SUPER ADMIN` -> `CORPORATION` -> `WARD` -> `CORPORATOR / OFFICER` -> `CITIZEN`
- **Scope Model**: `ALL_CORPORATIONS`, `CORPORATION`, `WARD`, `DEPARTMENT`, `ASSIGNED_ONLY`, `OWN_RECORD`
