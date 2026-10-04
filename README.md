# Roxiler Store Rating Platform

A production-minded full-stack Store Rating application built for the Roxiler Full Stack Intern assignment.

## Tech Stack

- **Frontend:** React 18 + Vite + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Password security:** bcryptjs
- **Architecture:** REST API + role-based access control

> The assignment accepts PostgreSQL/MySQL. This implementation uses PostgreSQL.

## Roles and Features

### System Administrator

- Dashboard counts for users, stores and ratings
- Create Admin/User/Owner accounts
- Create stores and optionally assign an Owner
- Filter and sort users
- Filter and sort stores
- View user details
- View an Owner's store rating
- Protected admin-only APIs

### Normal User

- Sign up and log in
- View, search and sort stores
- See overall store rating
- See their own submitted rating
- Submit a rating from 1-5
- Modify their previous rating
- Change password

### Store Owner

- Log in
- View only their assigned store
- See average rating
- See users who submitted ratings
- Change password

## Project Structure

```text
roxiler-store-rating/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seedAdmin.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vercel.json
├── database/
│   └── schema.sql
├── ASSESSMENT_CHECKLIST.md
├── README.md
└── .gitignore
```

## Validation Rules

- Name: **6-60 characters**
- Address: **1-400 characters**
- Password: **8-16 characters**, at least one uppercase letter and one special character
- Email: basic valid email format
- Rating: integer from **1 to 5**
- Roles: `ADMIN`, `USER`, `OWNER`
- Store owner assignment is validated server-side
- Database constraints also enforce role/rating/uniqueness rules

## Local Setup

### 1. Create PostgreSQL database

```sql
CREATE DATABASE roxiler_rating;
```

Then from the project root:

```bash
psql -U postgres -d roxiler_rating -f database/schema.sql
```

### 2. Configure backend

```bash
cd backend
```

Copy `.env.example` to `.env` and update the values.

Example:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_local_password@localhost:5432/roxiler_rating
JWT_SECRET=replace_this_with_a_random_secret_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChooseAStrong@123
```

Install and start:

```bash
npm install
npm run dev
```

API:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

### 3. Seed the admin account

On backend startup, the server creates the configured admin account if it does not already exist. The password is hashed with bcrypt before it is stored. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`; do not commit that file.

To seed manually instead:

```bash
cd backend
npm run seed:admin
```

### 4. Configure frontend

```bash
cd frontend
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Install and run:

```bash
npm install
npm run dev
```

Build verification:

```bash
npm run build
```

## API Overview

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Admin

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/dashboard` | ADMIN |
| GET | `/api/admin/users` | ADMIN |
| GET | `/api/admin/users/:id` | ADMIN |
| POST | `/api/admin/users` | ADMIN |
| GET | `/api/admin/stores` | ADMIN |
| POST | `/api/admin/stores` | ADMIN |

### Normal User

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/user/stores` | USER |
| POST | `/api/user/stores/:storeId/rating` | USER |

### Password

| Method | Endpoint | Access |
|---|---|---|
| PATCH | `/api/users/password` | Authenticated |

### Store Owner

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/owner/dashboard` | OWNER |

## Security / Quality Measures

- Passwords are hashed with bcrypt; plaintext passwords are never stored.
- JWT authentication is required for protected APIs.
- Role authorization is enforced on the backend, not only in React.
- SQL values use parameterized queries.
- Dynamic sort fields are selected only from server-side allowlists.
- Database constraints enforce rating range, roles and unique user/store ratings.
- Express `x-powered-by` header is disabled.
- JSON request size is limited.
- Centralized 404 and error handling is used.
- Async Express controllers are wrapped so rejected promises reach the error middleware.
- Secrets are kept in `.env`, while only safe examples are committed.
- Frontend routes are protected for a better user experience; backend authorization remains the real security boundary.

## Evaluator Smoke-Test Flow

1. Run the database schema.
2. Start backend.
3. Seed the admin.
4. Log in as Admin.
5. Create an Owner.
6. Create a normal User.
7. Create a Store and assign it to the Owner.
8. Log in as User and submit a 1-5 rating.
9. Modify the same rating.
10. Log in as Owner and verify the average and rater list.
11. Return to Admin and verify user/store filters, sorting and dashboard counts.
12. Try accessing another role's API with the wrong account; it should return `403`.
13. Try invalid rating, invalid role, invalid owner ID and invalid password; server-side validation should reject them.
14. Run frontend production build.

## Deployment Notes

### Frontend

The included `frontend/vercel.json` provides an SPA rewrite so React Router URLs can resolve correctly on Vercel.

Set:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

### Backend

Set production environment variables:

```env
PORT=5000
DATABASE_URL=YOUR_POSTGRES_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
CLIENT_URL=https://YOUR-FRONTEND-DOMAIN
NODE_ENV=production
```

Do not commit a real `.env` file or production credentials.

## Important Scope Note

This repository is an assignment implementation rather than a full production SaaS. Before a real public launch, add infrastructure-level protections such as rate limiting, structured logging/monitoring, automated tests, database migrations and a production secret-management solution.
