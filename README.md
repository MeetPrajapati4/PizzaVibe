# Pizza Delivery Application

Full-stack pizza delivery app for the Level 3 task. The original prompt mentions MongoDB, but this implementation uses **MySQL** as requested.

## Features

- User and admin registration/login with JWT authorization.
- Email verification, forgot-password, and reset-password flows.
- User dashboard with pizza varieties, custom pizza builder, and order history.
- Custom pizza selection with 5 bases, 5 sauces, cheese, veggies, and meat toppings.
- Razorpay test-mode checkout support, with a local mock checkout fallback when keys are not configured.
- Admin dashboard for inventory, stock thresholds, low-stock alerts, and order status updates.
- MySQL-backed stock deductions after successful orders.
- Admin email notification hooks for low inventory.

## Setup

1. Start MySQL with Docker, or use your own local MySQL server. The included Docker file is development-only and uses `root` with an empty password to match the default `.env.example`:

```bash
npm run db:up
```

2. Copy `backend/.env.example` to `backend/.env` and update the credentials if your MySQL user is different. XAMPP-style local MySQL usually works with `root` and an empty password.
3. Install dependencies:

```bash
npm run install:all
```

4. Start the backend:

```bash
npm run dev:backend
```

5. Start the frontend in another terminal:

```bash
npm run dev:frontend
```

The backend creates the database and tables automatically on startup, then seeds default pizzas, inventory, and an admin account.

## Default Admin

- Email: `admin@pizza.local`
- Password: `Admin@12345`

Change these in `backend/.env` using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Razorpay

For real Razorpay test-mode checkout, set:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `VITE_RAZORPAY_KEY_ID` in `frontend/.env`

Without these keys, the app still completes orders using a mock payment path so the assignment flow can be tested locally.

## Local Fallback

MySQL is still the primary database. For machines where MySQL is not installed yet, the backend starts with a local file-backed development store so the frontend and backend can run without crashing. Disable that behavior with:

```bash
ALLOW_DEMO_FALLBACK=false
```
