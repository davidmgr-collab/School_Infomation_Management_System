# SIMS — School Information Management System

A working starter project with:
- Public student directory (no login)
- One shared login page for Admin, Animation and Secretary
- Role-based dashboards and protected API routes
- Student CRUD for Admin and Secretary
- Academic year / term / level / combination filters
- Attendance recording for Animation
- MySQL/MariaDB database

## Requirements
- Node.js 20+ (18+ should also work)
- MySQL or MariaDB (XAMPP is suitable)
- A modern browser

## 1. Create the database
1. Open phpMyAdmin or the MySQL command line.
2. Import `database/sims_db.sql`.
3. The script creates a fresh `sims_db` database and its tables. **It drops and recreates `sims_db` if you run the included reset script.** Back up any existing database first.
4. The SQL creates role records and sample academic structure. It does not create a default password.

## 2. Backend setup
Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env` and set your database credentials and JWT secret.

Create the first administrator account:

```bash
npm run create-admin
```

The script prompts for name, username, email and password.

Start the backend:

```bash
npm run dev
```

API: http://localhost:5000/api  
Health: http://localhost:5000/api/health

## 3. Frontend setup
Open another terminal in `frontend`:

```bash
npm install
```

Copy `.env.example` to `.env` if you need a different API URL.

Start React:

```bash
npm run dev
```

Frontend: http://localhost:5173

## 4. Login roles
The shared login is `/login`. The backend reads the user's role and redirects:
- `admin` → `/admin/dashboard`
- `animation` → `/animation/dashboard`
- `secretary` → `/secretary/dashboard`

Create additional users through Admin → Users. Assign only the intended role.

## 5. Main routes
- `/` public student directory
- `/login` shared login
- `/admin/dashboard`
- `/admin/students`
- `/admin/users`
- `/animation/dashboard`
- `/animation/attendance`
- `/secretary/dashboard`
- `/secretary/students`

## Notes
- Public directory exposes only admission number, student name, gender, level and combination. Review local privacy requirements before publishing student data.
- This is a functional foundation, not a production-hardened deployment. Before public hosting, add HTTPS, rate limiting, backups, audit review, password reset, stronger validation and school-approved data privacy controls.
- If you already have an existing SIMS database, do not import the reset SQL over it. Back it up and compare schemas first.
