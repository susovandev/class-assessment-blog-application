import mongoose from 'mongoose';
import { config } from './index.js';

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(config.DATABASE_URI);
    console.log(
      `Connected to database: ${connectionInstance.connection.db.databaseName}`
    );
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    throw error;
  }
}
