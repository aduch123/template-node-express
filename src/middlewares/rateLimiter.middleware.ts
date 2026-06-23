import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants';

export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});