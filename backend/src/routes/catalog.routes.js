import { Router } from "express";
import { getPool } from "../db/pool.js";
import { getInventory, groupInventory } from "../services/inventoryService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const catalogRouter = Router();

catalogRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [pizzas] = await getPool().execute(
      `
        SELECT
          id, name, description, price, image_url AS imageUrl
        FROM pizzas
        WHERE active = TRUE
        ORDER BY price ASC
      `
    );
    const inventory = await getInventory();

    res.json({
      pizzas,
      ingredients: groupInventory(inventory)
    });
  })
);
