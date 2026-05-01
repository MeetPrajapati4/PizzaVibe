import { sequelize } from './config/db.js';
import models from './models/index.js'; // Ensure models are loaded

async function resetDB() {
  try {
    console.log('Dropping all tables...');
    await sequelize.drop(); // Drops all tables
    console.log('Recreating tables via force sync...');
    await sequelize.sync({ force: true });
    console.log('Database schema successfully reset!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to reset DB:', error);
    process.exit(1);
  }
}

resetDB();
