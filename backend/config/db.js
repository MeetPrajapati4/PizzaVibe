import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoURI || !mongoURI.startsWith('mongodb')) {
      console.log('⚠️ No MongoDB URI found. Falling back to SQL/Mock mode.');
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed essential data
    const { autoSeed } = await import('../utils/autoSeed.js');
    await autoSeed();
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export { mongoose };
export default connectDB;
