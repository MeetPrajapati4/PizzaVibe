import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createPaymentOrder } from "../services/paymentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const paymentRouter = Router();

paymentRouter.post(
  "/create-order",
  requireAuth,
  asyncHandler(async (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpError(400, "A positive amount is required.");
    }

    const paymentOrder = await createPaymentOrder(amount);
    res.json(paymentOrder);
  })
);
