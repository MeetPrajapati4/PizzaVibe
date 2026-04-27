import bcrypt from "bcryptjs";
import { Router } from "express";
import { getDemoState, groupDemoInventory, publicDemoUser, saveDemoState } from "../db/demoStore.js";
import { requireAdmin, requireDemoAuth } from "../middleware/demoAuth.js";
import { createPaymentOrder } from "../services/paymentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { sendLowStockEmail, sendPasswordResetEmail, sendVerificationEmail } from "../utils/mailer.js";
import { makeRandomToken, signAuthToken } from "../utils/tokens.js";

export const demoRouter = Router();

const statusLabels = new Set(["order_received", "in_kitchen", "sent_to_delivery", "delivered", "cancelled"]);
const categories = new Set(["base", "sauce", "cheese", "veggie", "meat"]);
const sizeBasePrice = {
  small: 179,
  medium: 249,
  large: 329
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function now() {
  return new Date().toISOString();
}

function lowStockItems() {
  return getDemoState()
    .inventoryItems.filter((item) => item.active && Number(item.quantity) <= Number(item.threshold))
    .sort((a, b) => a.quantity - b.quantity || a.name.localeCompare(b.name));
}

async function notifyLowStock() {
  const items = lowStockItems();
  if (!items.length) {
    return;
  }

  await sendLowStockEmail(items);
  const state = getDemoState();
  const timestamp = now();
  state.notifications.push(
    ...items.map((item) => ({
      id: state.notifications.length + 1,
      inventoryItemId: item.id,
      message: `${item.name} stock is low: ${item.quantity} ${item.unit}.`,
      createdAt: timestamp
    }))
  );
  await saveDemoState();
}

function orderView(order) {
  const state = getDemoState();
  const user = state.users.find((item) => item.id === order.userId);

  return {
    id: order.id,
    userId: order.userId,
    customerName: user?.name || "Customer",
    customerEmail: user?.email || "",
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentProvider: order.paymentProvider,
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: order.razorpayPaymentId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items
  };
}

function findIngredient(id) {
  return getDemoState().inventoryItems.find((item) => Number(item.id) === Number(id));
}

function requireIngredient(item, category, label) {
  if (!item || item.category !== category || !item.active) {
    throw new HttpError(400, `Please select a valid ${label}.`);
  }
}

demoRouter.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const state = getDemoState();
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || password.length < 8) {
      throw new HttpError(400, "Name, email, and an 8 character password are required.");
    }

    if (state.users.some((user) => user.email === email)) {
      throw new HttpError(409, "An account with this email already exists.");
    }

    const verificationToken = makeRandomToken();
    const user = {
      id: state.meta.nextUserId++,
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "user",
      isVerified: false,
      verificationToken,
      resetToken: null,
      resetTokenExpiresAt: null,
      createdAt: now(),
      updatedAt: now()
    };
    state.users.push(user);
    await saveDemoState();
    await sendVerificationEmail({ ...user, is_verified: false }, verificationToken);

    res.status(201).json({
      message: "Registration complete. Please verify your email before logging in.",
      user: publicDemoUser(user),
      developmentVerificationToken: verificationToken
    });
  })
);

demoRouter.post(
  "/auth/verify-email",
  asyncHandler(async (req, res) => {
    const token = String(req.body.token || req.query.token || "").trim();
    const user = getDemoState().users.find((item) => item.verificationToken === token);

    if (!user) {
      throw new HttpError(400, "Verification token is invalid or already used.");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.updatedAt = now();
    await saveDemoState();
    res.json({ message: "Email verified. You can now log in." });
  })
);

demoRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const user = getDemoState().users.find((item) => item.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password.");
    }

    if (!user.isVerified) {
      throw new HttpError(403, "Please verify your email before logging in.");
    }

    res.json({
      token: signAuthToken({ id: user.id, email: user.email, role: user.role }),
      user: publicDemoUser(user)
    });
  })
);

demoRouter.post(
  "/auth/forgot-password",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const user = getDemoState().users.find((item) => item.email === email);
    let developmentResetToken = null;

    if (user) {
      developmentResetToken = makeRandomToken();
      user.resetToken = developmentResetToken;
      user.resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;
      user.updatedAt = now();
      await saveDemoState();
      await sendPasswordResetEmail(user, developmentResetToken);
    }

    res.json({
      message: "If that email exists, a reset link has been sent.",
      developmentResetToken
    });
  })
);

demoRouter.post(
  "/auth/reset-password",
  asyncHandler(async (req, res) => {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");
    const user = getDemoState().users.find(
      (item) => item.resetToken === token && Number(item.resetTokenExpiresAt || 0) > Date.now()
    );

    if (!user || password.length < 8) {
      throw new HttpError(400, "Reset token is invalid or expired.");
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    user.updatedAt = now();
    await saveDemoState();
    res.json({ message: "Password updated. You can now log in." });
  })
);

demoRouter.get("/auth/me", requireDemoAuth, (req, res) => {
  res.json({ user: publicDemoUser(req.user) });
});

demoRouter.get("/catalog", (_req, res) => {
  const state = getDemoState();
  res.json({
    pizzas: state.pizzas.filter((pizza) => pizza.active),
    ingredients: groupDemoInventory(state.inventoryItems.filter((item) => item.active))
  });
});

demoRouter.post(
  "/payments/create-order",
  requireDemoAuth,
  asyncHandler(async (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpError(400, "A positive amount is required.");
    }

    res.json(await createPaymentOrder(amount));
  })
);

demoRouter.get("/orders/my", requireDemoAuth, (req, res) => {
  const orders = getDemoState()
    .orders.filter((order) => order.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(orderView);
  res.json({ orders });
});

demoRouter.post(
  "/orders",
  requireDemoAuth,
  asyncHandler(async (req, res) => {
    const state = getDemoState();
    const quantity = Math.max(1, Math.min(10, Number.parseInt(req.body.quantity, 10) || 1));
    const size = ["small", "medium", "large"].includes(req.body.size) ? req.body.size : "medium";
    const base = findIngredient(req.body.baseId);
    const sauce = findIngredient(req.body.sauceId);
    const cheese = findIngredient(req.body.cheeseId);
    const toppingIds = Array.isArray(req.body.toppingIds)
      ? [...new Set(req.body.toppingIds.map((id) => Number.parseInt(id, 10)).filter(Number.isFinite))]
      : [];
    const toppings = toppingIds.map(findIngredient);

    requireIngredient(base, "base", "pizza base");
    requireIngredient(sauce, "sauce", "sauce");
    requireIngredient(cheese, "cheese", "cheese");

    for (const topping of toppings) {
      if (!topping || !["veggie", "meat"].includes(topping.category) || !topping.active) {
        throw new HttpError(400, "One or more toppings are invalid.");
      }
    }

    const stockItems = [base, sauce, cheese, ...toppings];
    for (const item of stockItems) {
      if (item.quantity < quantity) {
        throw new HttpError(409, `${item.name} is out of stock for this quantity.`);
      }
    }

    const extras = stockItems.reduce((sum, item) => sum + Number(item.priceDelta || 0), 0);
    const unitPrice = Number(sizeBasePrice[size]) + extras;
    const timestamp = now();
    const order = {
      id: state.meta.nextOrderId++,
      userId: req.user.id,
      totalAmount: unitPrice * quantity,
      status: "order_received",
      paymentStatus: req.body.payment?.status === "failed" ? "failed" : "paid",
      paymentProvider: req.body.payment?.provider || "mock",
      razorpayOrderId: req.body.payment?.orderId || null,
      razorpayPaymentId: req.body.payment?.paymentId || null,
      createdAt: timestamp,
      updatedAt: timestamp,
      items: [
        {
          id: state.meta.nextOrderItemId++,
          pizzaName: String(req.body.pizzaName || "Custom Pizza").trim().slice(0, 160) || "Custom Pizza",
          size,
          quantity,
          unitPrice,
          base: base.name,
          sauce: sauce.name,
          cheese: cheese.name,
          toppings: toppings.map((item) => ({ name: item.name, category: item.category }))
        }
      ]
    };

    stockItems.forEach((item) => {
      item.quantity -= quantity;
      item.updatedAt = timestamp;
    });
    state.orders.push(order);
    await saveDemoState();
    await notifyLowStock();

    res.status(201).json({ order: orderView(order) });
  })
);

demoRouter.get("/admin/inventory", requireDemoAuth, requireAdmin, (_req, res) => {
  const state = getDemoState();
  res.json({
    inventory: groupDemoInventory(state.inventoryItems),
    lowStock: lowStockItems()
  });
});

demoRouter.post(
  "/admin/inventory",
  requireDemoAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const state = getDemoState();
    const category = String(req.body.category || "");
    const name = String(req.body.name || "").trim();
    const quantity = Number.parseInt(req.body.quantity, 10);
    const threshold = Number.parseInt(req.body.threshold, 10);
    const priceDelta = Number(req.body.priceDelta || 0);
    const unit = String(req.body.unit || "servings").trim();

    if (!categories.has(category) || !name || !Number.isInteger(quantity) || !Number.isInteger(threshold)) {
      throw new HttpError(400, "Category, name, quantity, and threshold are required.");
    }

    const existing = state.inventoryItems.find((item) => item.category === category && item.name === name);
    if (existing) {
      Object.assign(existing, { quantity, threshold, priceDelta, unit, active: true, updatedAt: now() });
      await saveDemoState();
      res.status(201).json({ id: existing.id, message: "Inventory item saved." });
      return;
    }

    const item = {
      id: state.meta.nextInventoryId++,
      category,
      name,
      quantity,
      threshold,
      unit,
      priceDelta,
      active: true,
      createdAt: now(),
      updatedAt: now()
    };
    state.inventoryItems.push(item);
    await saveDemoState();
    res.status(201).json({ id: item.id, message: "Inventory item saved." });
  })
);

demoRouter.patch(
  "/admin/inventory/:id",
  requireDemoAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = findIngredient(req.params.id);
    if (!item) {
      throw new HttpError(404, "Inventory item not found.");
    }

    if (req.body.quantity !== undefined) item.quantity = Number.parseInt(req.body.quantity, 10);
    if (req.body.threshold !== undefined) item.threshold = Number.parseInt(req.body.threshold, 10);
    if (req.body.priceDelta !== undefined) item.priceDelta = Number(req.body.priceDelta);
    if (req.body.active !== undefined) item.active = Boolean(req.body.active);
    item.updatedAt = now();
    await saveDemoState();
    res.json({ message: "Inventory item updated." });
  })
);

demoRouter.get("/admin/orders", requireDemoAuth, requireAdmin, (_req, res) => {
  const orders = getDemoState()
    .orders.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(orderView);
  res.json({ orders });
});

demoRouter.patch(
  "/admin/orders/:id/status",
  requireDemoAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const order = getDemoState().orders.find((item) => Number(item.id) === Number(req.params.id));

    if (!order) {
      throw new HttpError(404, "Order not found.");
    }

    if (!statusLabels.has(req.body.status)) {
      throw new HttpError(400, "Invalid order status.");
    }

    order.status = req.body.status;
    order.updatedAt = now();
    await saveDemoState();
    res.json({ order: orderView(order) });
  })
);
