import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL/MariaDB connected via Sequelize (XAMPP)');
    
    // Sync models
    await sequelize.sync({ alter: true }); 
    console.log('🔄 Database models synchronized');
  } catch (error) {
    console.error(`❌ MySQL connection error: ${error.message}`);
    console.log('💡 Ensure XAMPP MySQL is running and database "pizzavibe" exists.');
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
