import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL/MariaDB connected via Sequelize (XAMPP)');
    
    // Sync models
    await sequelize.sync({ alter: true }); 
    console.log('🔄 Database models synchronized');

    // Auto-seed essential data
    const { autoSeed } = await import('../utils/autoSeed.js');
    await autoSeed();
  } catch (error) {
    console.error(`❌ MySQL connection error: ${error.message}`);
    console.log('💡 Ensure XAMPP MySQL is running and database "pizzavibe" exists.');
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
