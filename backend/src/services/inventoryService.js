import { getPool } from "../db/pool.js";
import { env } from "../config/env.js";
import { sendLowStockEmail } from "../utils/mailer.js";

export function groupInventory(rows) {
  return rows.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});
}

export async function getInventory({ includeInactive = false } = {}) {
  const [rows] = await getPool().execute(
    `
      SELECT
        id, category, name, quantity, threshold, unit,
        price_delta AS priceDelta, active, created_at AS createdAt, updated_at AS updatedAt
      FROM inventory_items
      ${includeInactive ? "" : "WHERE active = TRUE"}
      ORDER BY FIELD(category, 'base', 'sauce', 'cheese', 'veggie', 'meat'), name
    `
  );

  return rows;
}

export async function getLowStockItems() {
  const [rows] = await getPool().execute(
    `
      SELECT
        id, category, name, quantity, threshold, unit,
        price_delta AS priceDelta
      FROM inventory_items
      WHERE active = TRUE AND quantity <= threshold
      ORDER BY quantity ASC, name ASC
    `
  );

  return rows;
}

export async function notifyLowStockItems() {
  const pool = getPool();
  const lowStockItems = await getLowStockItems();

  if (!lowStockItems.length) {
    return [];
  }

  const [recentNotifications] = await pool.execute(
    `
      SELECT inventory_item_id AS itemId
      FROM notifications
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 HOUR)
    `
  );
  const recentlySent = new Set(recentNotifications.map((row) => Number(row.itemId)));
  const itemsToNotify = lowStockItems.filter((item) => !recentlySent.has(Number(item.id)));

  if (!itemsToNotify.length) {
    return [];
  }

  await sendLowStockEmail(itemsToNotify);

  for (const item of itemsToNotify) {
    await pool.execute(
      `
        INSERT INTO notifications (inventory_item_id, channel, message, sent_to, is_sent)
        VALUES (?, 'email', ?, ?, TRUE)
      `,
      [
        item.id,
        `${item.name} stock is low: ${item.quantity} ${item.unit}, threshold ${item.threshold}.`,
        env.mail.adminNotificationEmail
      ]
    );
  }

  return itemsToNotify;
}

export function startStockMonitor() {
  const interval = setInterval(() => {
    notifyLowStockItems().catch((error) => {
      console.error("[stock-monitor]", error);
    });
  }, env.stockCheckIntervalMs);

  interval.unref?.();
  return interval;
}
