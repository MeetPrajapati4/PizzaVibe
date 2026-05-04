import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './config/db.js';

async function checkSchema() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND column_name = 'id';
    `);
    console.log(results);
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
