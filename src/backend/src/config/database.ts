import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/major-tracker';

export const connectDB = async (): Promise<void> => {
  try {
    logger.info('Attempting to connect to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB successfully');
    
    // Log database events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 