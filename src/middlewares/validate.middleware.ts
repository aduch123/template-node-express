import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import ApiError from '../utils/ApiError';
import { HTTP_STATUS } from '../constants';

const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => e.message);
        return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors));
      }
      next(error);
    }
  };
};

export default validate;