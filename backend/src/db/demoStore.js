import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { inventorySeed, pizzaSeed } from "../data/defaultCatalog.js";

const storePath = path.resolve(process.cwd(), "tmp", "demo-db.json");

let state;

export async function initializeDemoDatabase() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });

  try {
    const raw = await fs.readFile(storePath, "utf8");
    state = JSON.parse(raw);
    return state;
  } catch {
    const passwordHash = await bcrypt.hash(env.adminPassword, 12);
    state = {
      meta: {
        nextUserId: 2,
        nextInventoryId: inventorySeed.length + 1,
        nextPizzaId: pizzaSeed.length + 1,
        nextOrderId: 1,
        nextOrderItemId: 1
      },
      users: [
        {
          id: 1,
          name: "Admin",
          email: env.adminEmail.toLowerCase(),
          passwordHash,
          role: "admin",
          isVerified: true,
          verificationToken: null,
          resetToken: null,
          resetTokenExpiresAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      inventoryItems: inventorySeed.map((item, index) => ({
        id: index + 1,
        category: item.category,
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold,
        unit: item.unit,
        priceDelta: item.priceDelta,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      pizzas: pizzaSeed.map((pizza, index) => ({
        id: index + 1,
        name: pizza.name,
        description: pizza.description,
        price: pizza.price,
        imageUrl: pizza.imageUrl,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      orders: [],
      notifications: []
    };
    await saveDemoState();
    return state;
  }
}

export function getDemoState() {
  if (!state) {
    throw new Error("Demo database has not been initialized.");
  }

  return state;
}

export async function saveDemoState() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(state, null, 2));
}

export function publicDemoUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: Boolean(user.isVerified)
  };
}

export function groupDemoInventory(items) {
  return items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});
}
