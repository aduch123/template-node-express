import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { defaultLimiter } from './middlewares/rateLimiter.middleware';
import errorMiddleware from './middlewares/error.middleware';
import { env } from './config/env';
import router from './routes';
import logger from './utils/logger';
import ApiError from './utils/ApiError';
import { HTTP_STATUS } from './constants';
import { randomUUID } from 'crypto';
const app = express();

// Request ID
app.use((req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Security
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production'
    ? ['https://yourdomain.com', 'https://app.yourdomain.com']
    : '*',
  credentials: true,
}));
app.use(defaultLimiter);

// Logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/v1', router);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.method} ${req.path} not found`));
});

// Error handler
app.use(errorMiddleware);

export default app;