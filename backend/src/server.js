import { env } from "./config/env.js";
import { initializeDatabase } from "./db/schema.js";
import { initializeDemoDatabase } from "./db/demoStore.js";
import { setDatabaseRuntime } from "./db/runtime.js";
import { createApp } from "./app.js";
import { startStockMonitor } from "./services/inventoryService.js";

async function main() {
  try {
    await initializeDatabase();
    setDatabaseRuntime({ mode: "mysql", warning: null });
    startStockMonitor();
  } catch (error) {
    if (!env.allowDemoFallback) {
      throw error;
    }

    await initializeDemoDatabase();
    setDatabaseRuntime({
      mode: "demo",
      warning: `MySQL is not reachable (${error.code || error.message}). Using local development demo store.`
    });
    console.warn("[database]", `MySQL unavailable: ${error.code || error.message}. Using demo store.`);
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Pizza Delivery API running on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
