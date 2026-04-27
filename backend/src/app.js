import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { getDatabaseRuntime } from "./db/runtime.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { catalogRouter } from "./routes/catalog.routes.js";
import { demoRouter } from "./routes/demo.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigins = new Set([
    env.clientUrl,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin is not allowed by CORS."));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "pizza-delivery-api", database: getDatabaseRuntime() });
  });

  if (getDatabaseRuntime().mode === "demo") {
    app.use("/api", demoRouter);
  } else {
    app.use("/api/auth", authRouter);
    app.use("/api/catalog", catalogRouter);
    app.use("/api/payments", paymentRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/admin", adminRouter);
  }

  app.use((_req, _res, next) => {
    const error = new Error("Route not found.");
    error.status = 404;
    next(error);
  });

  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    if (status >= 500) {
      console.error(error);
    }
    res.status(status).json({
      message: error.message || "Something went wrong."
    });
  });

  return app;
}
