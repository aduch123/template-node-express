import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';
import { HTTP_STATUS } from '../constants';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    logger.error(`[${req.method}] ${req.path} - ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  logger.error(`[${req.method}] ${req.path} - ${err.message}`);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    errors: [],
  });
};

export default errorMiddleware;