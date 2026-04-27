import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "pizza_delivery_mysql"
  },
  jwtSecret: process.env.JWT_SECRET || "change-this-secret-before-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@pizza.local",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@12345",
  mail: {
    host: process.env.MAIL_HOST || "",
    port: Number(process.env.MAIL_PORT || 587),
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
    from: process.env.MAIL_FROM || "Pizza Delivery <no-reply@pizza.local>",
    adminNotificationEmail:
      process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "admin@pizza.local"
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    currency: process.env.RAZORPAY_CURRENCY || "INR"
  },
  stockCheckIntervalMs: Number(process.env.STOCK_CHECK_INTERVAL_MS || 900000),
  allowDemoFallback: process.env.ALLOW_DEMO_FALLBACK !== "false"
};
