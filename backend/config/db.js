import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Supabase is PostgreSQL based
const isPostgres = true; 

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // Nodemon triggered restart
    console.log('✅ Supabase (PostgreSQL) connected via Sequelize');

    // Auto-seed essential data if needed
    const { default: models } = await import('../models/index.js');
    await sequelize.sync(); // Sync tables without alter to prevent Postgres FK bugs

    const { autoSeed } = await import('../utils/autoSeed.js');
    await autoSeed();
  } catch (error) {
    console.error(`❌ Supabase connection error: ${error.message}`);
    console.log('💡 Ensure your DATABASE_URL in .env is correct and includes SSL.');
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
