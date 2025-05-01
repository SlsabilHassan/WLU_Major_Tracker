import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import majorRoutes from './routes/majorRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// MongoDB URI is required
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/major-tracker';
if (!MONGODB_URI) {
  logger.error('MONGODB_URI is not defined');
  process.exit(1);
}

const app = express();
const PORT = 3001; // Fixed port for local development

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'WLU Major Tracker API',
    endpoints: {
      health: '/api/health',
      majors: '/api/majors',
      majorByName: '/api/majors/:major'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'healthy', message: 'Backend server is running!' });
});

// Routes
app.use('/api/majors', majorRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: {
      health: '/api/health',
      majors: '/api/majors',
      majorByName: '/api/majors/:major'
    }
  });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const server = app.listen(PORT, '127.0.0.1', () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
      logger.info('Available endpoints:');
      logger.info(`- GET /api/health`);
      logger.info(`- GET /api/majors`);
      logger.info(`- GET /api/majors/:major`);
    });

    // Handle server shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export the Express API for Vercel
export default app; 