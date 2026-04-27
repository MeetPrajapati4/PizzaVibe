import { Router } from "express";
import { getPool } from "../db/pool.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { getInventory, getLowStockItems, groupInventory } from "../services/inventoryService.js";
import { getOrders, updateOrderStatus } from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const categories = new Set(["base", "sauce", "cheese", "veggie", "meat"]);

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get(
  "/inventory",
  asyncHandler(async (_req, res) => {
    const inventory = await getInventory({ includeInactive: true });
    const lowStock = await getLowStockItems();
    res.json({
      inventory: groupInventory(inventory),
      lowStock
    });
  })
);

adminRouter.post(
  "/inventory",
  asyncHandler(async (req, res) => {
    const category = String(req.body.category || "");
    const name = String(req.body.name || "").trim();
    const quantity = Number.parseInt(req.body.quantity, 10);
    const threshold = Number.parseInt(req.body.threshold, 10);
    const unit = String(req.body.unit || "servings").trim();
    const priceDelta = Number(req.body.priceDelta || 0);

    if (!categories.has(category) || !name || !Number.isInteger(quantity) || !Number.isInteger(threshold)) {
      throw new HttpError(400, "Category, name, quantity, and threshold are required.");
    }

    const [result] = await getPool().execute(
      `
        INSERT INTO inventory_items (category, name, quantity, threshold, unit, price_delta, active)
        VALUES (?, ?, ?, ?, ?, ?, TRUE)
        ON DUPLICATE KEY UPDATE
          quantity = VALUES(quantity),
          threshold = VALUES(threshold),
          unit = VALUES(unit),
          price_delta = VALUES(price_delta),
          active = TRUE
      `,
      [category, name, quantity, threshold, unit, priceDelta]
    );

    res.status(201).json({ id: result.insertId, message: "Inventory item saved." });
  })
);

adminRouter.patch(
  "/inventory/:id",
  asyncHandler(async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const quantity = req.body.quantity === undefined ? null : Number.parseInt(req.body.quantity, 10);
    const threshold = req.body.threshold === undefined ? null : Number.parseInt(req.body.threshold, 10);
    const priceDelta = req.body.priceDelta === undefined ? null : Number(req.body.priceDelta);
    const active = req.body.active === undefined ? null : Boolean(req.body.active);

    const [result] = await getPool().execute(
      `
        UPDATE inventory_items
        SET
          quantity = COALESCE(?, quantity),
          threshold = COALESCE(?, threshold),
          price_delta = COALESCE(?, price_delta),
          active = COALESCE(?, active)
        WHERE id = ?
      `,
      [quantity, threshold, priceDelta, active, id]
    );

    if (!result.affectedRows) {
      throw new HttpError(404, "Inventory item not found.");
    }

    res.json({ message: "Inventory item updated." });
  })
);

adminRouter.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const orders = await getOrders();
    res.json({ orders });
  })
);

adminRouter.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const order = await updateOrderStatus(Number.parseInt(req.params.id, 10), req.body.status);
    res.json({ order });
  })
);
