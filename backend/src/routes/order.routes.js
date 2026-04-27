import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createPizzaOrder, getOrders } from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const orderRouter = Router();

orderRouter.get(
  "/my",
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await getOrders({ userId: req.user.id });
    res.json({ orders });
  })
);

orderRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await createPizzaOrder(req.user.id, req.body);
    res.status(201).json({ order });
  })
);
