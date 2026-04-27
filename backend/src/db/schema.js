import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { inventorySeed, pizzaSeed } from "../data/defaultCatalog.js";
import { createServerConnection, getPool } from "./pool.js";

function assertSafeDatabaseName(database) {
  if (!/^[a-zA-Z0-9_]+$/.test(database)) {
    throw new Error("MYSQL_DATABASE can only contain letters, numbers, and underscores.");
  }
}

export async function initializeDatabase() {
  assertSafeDatabaseName(env.mysql.database);

  const serverConnection = await createServerConnection();
  await serverConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.mysql.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await serverConnection.end();

  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      verification_token VARCHAR(128) NULL,
      reset_token VARCHAR(128) NULL,
      reset_token_expires_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY users_email_unique (email),
      KEY users_verification_token_idx (verification_token),
      KEY users_reset_token_idx (reset_token)
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      category ENUM('base', 'sauce', 'cheese', 'veggie', 'meat') NOT NULL,
      name VARCHAR(140) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      threshold INT NOT NULL DEFAULT 20,
      unit VARCHAR(40) NOT NULL DEFAULT 'servings',
      price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY inventory_category_name_unique (category, name)
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pizzas (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(140) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY pizzas_name_unique (name)
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM('order_received', 'in_kitchen', 'sent_to_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'order_received',
      payment_status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'paid',
      payment_provider VARCHAR(40) NOT NULL DEFAULT 'mock',
      razorpay_order_id VARCHAR(120) NULL,
      razorpay_payment_id VARCHAR(120) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY orders_user_id_idx (user_id),
      CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id BIGINT UNSIGNED NOT NULL,
      pizza_name VARCHAR(160) NOT NULL,
      base_item_id BIGINT UNSIGNED NOT NULL,
      sauce_item_id BIGINT UNSIGNED NOT NULL,
      cheese_item_id BIGINT UNSIGNED NOT NULL,
      size ENUM('small', 'medium', 'large') NOT NULL DEFAULT 'medium',
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      PRIMARY KEY (id),
      KEY order_items_order_id_idx (order_id),
      CONSTRAINT order_items_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      CONSTRAINT order_items_base_fk FOREIGN KEY (base_item_id) REFERENCES inventory_items(id),
      CONSTRAINT order_items_sauce_fk FOREIGN KEY (sauce_item_id) REFERENCES inventory_items(id),
      CONSTRAINT order_items_cheese_fk FOREIGN KEY (cheese_item_id) REFERENCES inventory_items(id)
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_item_toppings (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_item_id BIGINT UNSIGNED NOT NULL,
      inventory_item_id BIGINT UNSIGNED NOT NULL,
      PRIMARY KEY (id),
      KEY order_item_toppings_item_idx (inventory_item_id),
      CONSTRAINT order_item_toppings_item_fk FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
      CONSTRAINT order_item_toppings_order_item_fk FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS stock_events (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      inventory_item_id BIGINT UNSIGNED NOT NULL,
      order_id BIGINT UNSIGNED NULL,
      change_amount INT NOT NULL,
      reason VARCHAR(180) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY stock_events_item_id_idx (inventory_item_id),
      CONSTRAINT stock_events_item_fk FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
      CONSTRAINT stock_events_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      inventory_item_id BIGINT UNSIGNED NOT NULL,
      channel VARCHAR(40) NOT NULL DEFAULT 'email',
      message TEXT NOT NULL,
      sent_to VARCHAR(190) NOT NULL,
      is_sent BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY notifications_item_id_idx (inventory_item_id),
      CONSTRAINT notifications_item_fk FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
    ) ENGINE=InnoDB;
  `);

  await seedInventory(pool);
  await seedPizzas(pool);
  await seedAdmin(pool);
}

async function seedInventory(pool) {
  for (const item of inventorySeed) {
    await pool.execute(
      `
        INSERT INTO inventory_items (category, name, quantity, threshold, unit, price_delta, active)
        VALUES (:category, :name, :quantity, :threshold, :unit, :priceDelta, TRUE)
        ON DUPLICATE KEY UPDATE
          threshold = VALUES(threshold),
          unit = VALUES(unit),
          price_delta = VALUES(price_delta),
          active = TRUE
      `,
      item
    );
  }
}

async function seedPizzas(pool) {
  for (const pizza of pizzaSeed) {
    await pool.execute(
      `
        INSERT INTO pizzas (name, description, price, image_url, active)
        VALUES (:name, :description, :price, :imageUrl, TRUE)
        ON DUPLICATE KEY UPDATE
          description = VALUES(description),
          price = VALUES(price),
          image_url = VALUES(image_url),
          active = TRUE
      `,
      pizza
    );
  }
}

async function seedAdmin(pool) {
  const email = env.adminEmail.toLowerCase();
  const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);

  if (existing.length) {
    await pool.execute("UPDATE users SET role = 'admin', is_verified = TRUE WHERE email = ?", [email]);
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await pool.execute(
    `
      INSERT INTO users (name, email, password_hash, role, is_verified)
      VALUES (?, ?, ?, 'admin', TRUE)
    `,
    ["Admin", email, passwordHash]
  );
}
