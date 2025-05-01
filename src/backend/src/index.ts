import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '@/config/database';
import majorRoutes from '@/routes/majorRoutes';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8080', 10);

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Routes
app.use('/api/majors', majorRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, '0.0.0.0', () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 