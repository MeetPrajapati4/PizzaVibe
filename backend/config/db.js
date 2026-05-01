import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isPostgres = process.env.DATABASE_URL?.startsWith('postgres') || process.env.DB_DIALECT === 'postgres';

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: isPostgres ? 'postgres' : 'mysql',
      logging: false,
      dialectOptions: isPostgres ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {
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

export const connectDB = async () => {
  try {
    // Connect to SQL (MySQL or Postgres)
    await sequelize.authenticate();
    console.log(`✅ ${isPostgres ? 'Supabase/PostgreSQL' : 'MySQL/MariaDB'} connected via Sequelize`);

    // Connect to MongoDB if URI is present
    const mongoURI = process.env.MONGODB_URI;
    if (mongoURI && mongoURI.startsWith('mongodb')) {
      const conn = await mongoose.connect(mongoURI, {
        autoIndex: true,
      });
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('⚠️ No MongoDB URI found. Using SQL database only.');
    }

    // Auto-seed essential data
    const { autoSeed } = await import('../utils/autoSeed.js');
    await autoSeed();
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    if (isPostgres) {
      console.log('💡 Ensure your Supabase connection string is correct and includes SSL.');
    } else {
      console.log('💡 Ensure XAMPP MySQL is running and database "pizzavibe" exists.');
    }
    process.exit(1);
  }
};

export { mongoose, sequelize };
export default connectDB;
