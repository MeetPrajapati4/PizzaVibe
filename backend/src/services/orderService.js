import { getPool } from "../db/pool.js";
import { HttpError } from "../utils/httpError.js";
import { notifyLowStockItems } from "./inventoryService.js";

const sizeBasePrice = {
  small: 179,
  medium: 249,
  large: 329
};

const validStatuses = new Set(["order_received", "in_kitchen", "sent_to_delivery", "delivered", "cancelled"]);

function toNumber(value) {
  return Number.parseInt(value, 10);
}

function normalizeOrderPayload(payload) {
  const toppingIds = Array.isArray(payload.toppingIds)
    ? [...new Set(payload.toppingIds.map(toNumber).filter(Number.isFinite))]
    : [];

  return {
    pizzaName: String(payload.pizzaName || "Custom Pizza").trim().slice(0, 160) || "Custom Pizza",
    size: ["small", "medium", "large"].includes(payload.size) ? payload.size : "medium",
    baseId: toNumber(payload.baseId),
    sauceId: toNumber(payload.sauceId),
    cheeseId: toNumber(payload.cheeseId),
    toppingIds,
    quantity: Math.max(1, Math.min(10, toNumber(payload.quantity) || 1)),
    payment: payload.payment || {}
  };
}

function requireIngredient(item, expectedCategory, label) {
  if (!item || item.category !== expectedCategory || !item.active) {
    throw new HttpError(400, `Please select a valid ${label}.`);
  }
}

export async function createPizzaOrder(userId, rawPayload) {
  const payload = normalizeOrderPayload(rawPayload);

  if (!payload.baseId || !payload.sauceId || !payload.cheeseId) {
    throw new HttpError(400, "Base, sauce, and cheese are required.");
  }

  const selectedIds = [...new Set([payload.baseId, payload.sauceId, payload.cheeseId, ...payload.toppingIds])];
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const placeholders = selectedIds.map(() => "?").join(",");
    const [ingredientRows] = await connection.execute(
      `
        SELECT id, category, name, quantity, threshold, price_delta AS priceDelta, active
        FROM inventory_items
        WHERE id IN (${placeholders})
        FOR UPDATE
      `,
      selectedIds
    );
    const ingredients = new Map(ingredientRows.map((item) => [Number(item.id), item]));

    const base = ingredients.get(payload.baseId);
    const sauce = ingredients.get(payload.sauceId);
    const cheese = ingredients.get(payload.cheeseId);

    requireIngredient(base, "base", "pizza base");
    requireIngredient(sauce, "sauce", "sauce");
    requireIngredient(cheese, "cheese", "cheese");

    const toppings = payload.toppingIds.map((id) => {
      const item = ingredients.get(id);
      if (!item || !["veggie", "meat"].includes(item.category) || !item.active) {
        throw new HttpError(400, "One or more toppings are invalid.");
      }
      return item;
    });

    const stockItems = [base, sauce, cheese, ...toppings];
    for (const item of stockItems) {
      if (item.quantity < payload.quantity) {
        throw new HttpError(409, `${item.name} is out of stock for this quantity.`);
      }
    }

    const extras = stockItems.reduce((sum, item) => sum + Number(item.priceDelta || 0), 0);
    const unitPrice = Number(sizeBasePrice[payload.size]) + extras;
    const totalAmount = unitPrice * payload.quantity;
    const paymentProvider = payload.payment.provider || "mock";
    const paymentStatus = payload.payment.status === "failed" ? "failed" : "paid";

    const [orderResult] = await connection.execute(
      `
        INSERT INTO orders (
          user_id, total_amount, payment_status, payment_provider,
          razorpay_order_id, razorpay_payment_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        totalAmount,
        paymentStatus,
        paymentProvider,
        payload.payment.orderId || null,
        payload.payment.paymentId || null
      ]
    );
    const orderId = orderResult.insertId;

    const [orderItemResult] = await connection.execute(
      `
        INSERT INTO order_items (
          order_id, pizza_name, base_item_id, sauce_item_id, cheese_item_id,
          size, quantity, unit_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        orderId,
        payload.pizzaName,
        payload.baseId,
        payload.sauceId,
        payload.cheeseId,
        payload.size,
        payload.quantity,
        unitPrice
      ]
    );
    const orderItemId = orderItemResult.insertId;

    for (const topping of toppings) {
      await connection.execute(
        "INSERT INTO order_item_toppings (order_item_id, inventory_item_id) VALUES (?, ?)",
        [orderItemId, topping.id]
      );
    }

    for (const item of stockItems) {
      await connection.execute("UPDATE inventory_items SET quantity = quantity - ? WHERE id = ?", [
        payload.quantity,
        item.id
      ]);
      await connection.execute(
        `
          INSERT INTO stock_events (inventory_item_id, order_id, change_amount, reason)
          VALUES (?, ?, ?, ?)
        `,
        [item.id, orderId, -payload.quantity, "Order placed"]
      );
    }

    await connection.commit();
    await notifyLowStockItems();
    return getOrderById(orderId, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getOrderById(orderId, userId = null) {
  const whereUser = userId ? "AND o.user_id = ?" : "";
  const params = userId ? [orderId, userId] : [orderId];
  const [orders] = await getPool().execute(
    `
      SELECT
        o.id, o.user_id AS userId, u.name AS customerName, u.email AS customerEmail,
        o.total_amount AS totalAmount, o.status, o.payment_status AS paymentStatus,
        o.payment_provider AS paymentProvider, o.razorpay_order_id AS razorpayOrderId,
        o.razorpay_payment_id AS razorpayPaymentId,
        o.created_at AS createdAt, o.updated_at AS updatedAt
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id = ? ${whereUser}
      LIMIT 1
    `,
    params
  );

  if (!orders.length) {
    throw new HttpError(404, "Order not found.");
  }

  const order = orders[0];
  order.items = await getOrderItems(order.id);
  return order;
}

export async function getOrders({ userId = null } = {}) {
  const params = [];
  let where = "";

  if (userId) {
    where = "WHERE o.user_id = ?";
    params.push(userId);
  }

  const [orders] = await getPool().execute(
    `
      SELECT
        o.id, o.user_id AS userId, u.name AS customerName, u.email AS customerEmail,
        o.total_amount AS totalAmount, o.status, o.payment_status AS paymentStatus,
        o.payment_provider AS paymentProvider, o.created_at AS createdAt, o.updated_at AS updatedAt
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ${where}
      ORDER BY o.created_at DESC
      LIMIT 100
    `,
    params
  );

  for (const order of orders) {
    order.items = await getOrderItems(order.id);
  }

  return orders;
}

export async function updateOrderStatus(orderId, status) {
  if (!validStatuses.has(status)) {
    throw new HttpError(400, "Invalid order status.");
  }

  const [result] = await getPool().execute("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

  if (!result.affectedRows) {
    throw new HttpError(404, "Order not found.");
  }

  return getOrderById(orderId);
}

async function getOrderItems(orderId) {
  const [items] = await getPool().execute(
    `
      SELECT
        oi.id, oi.pizza_name AS pizzaName, oi.size, oi.quantity, oi.unit_price AS unitPrice,
        base.name AS base, sauce.name AS sauce, cheese.name AS cheese
      FROM order_items oi
      JOIN inventory_items base ON base.id = oi.base_item_id
      JOIN inventory_items sauce ON sauce.id = oi.sauce_item_id
      JOIN inventory_items cheese ON cheese.id = oi.cheese_item_id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `,
    [orderId]
  );

  for (const item of items) {
    const [toppings] = await getPool().execute(
      `
        SELECT inv.name, inv.category
        FROM order_item_toppings oit
        JOIN inventory_items inv ON inv.id = oit.inventory_item_id
        WHERE oit.order_item_id = ?
        ORDER BY inv.category, inv.name
      `,
      [item.id]
    );
    item.toppings = toppings;
  }

  return items;
}
