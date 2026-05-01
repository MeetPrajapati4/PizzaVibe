# 🌐 PizzaVibe Online Database Setup Guide

To use PizzaVibe in production (Vercel), you must connect it to a Cloud MySQL database. Follow these steps to get set up for free in 2 minutes.

---

### 1. Create a Free MySQL Database
We recommend **Aiven** or **Railway** for the most reliable connection.

#### Option A: Aiven (Recommended)
1. Go to [aiven.io](https://aiven.io/) and create a free account.
2. Create a **MySQL** service (the "Free Tier" is fine).
3. Wait for the service to start, then find your **Service URI**.
4. It will look like this: `mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED`

#### Option B: Railway
1. Go to [railway.app](https://railway.app/).
2. Click "New Project" -> "Provision MySQL".
3. Once created, go to the **Variables** tab and copy the `MYSQL_URL`.

---

### 2. Configure Vercel
Go to your **Vercel Project Dashboard** -> **Settings** -> **Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | *Your Connection String from Step 1* |
| `DB_SSL` | `true` |
| `JWT_SECRET` | *Any random strong string* |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://your-project-name.vercel.app` |

---

### 3. IP Whitelisting (CRITICAL)
Vercel uses dynamic IP addresses. You must allow all connections to your database:
* **Aiven**: In your Service settings, find "Allowed IP Addresses" and add `0.0.0.0/0`.
* **Railway**: No action needed (it's public by default).

---

### 🚀 What happens next?
Once you save the Environment Variables on Vercel and **Redeploy** your project:
1. PizzaVibe will automatically connect to your new online database.
2. It will **automatically create all tables**.
3. It will **automatically seed** the `Admin@Boss` account and the entire Pizza Menu.
4. You can log in immediately and start using the app!

---
**Need help?** Check the server logs in Vercel to see if there are any connection errors.
