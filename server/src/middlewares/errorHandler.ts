import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    status === 500
      ? 'Internal server error'
      : err.message || 'Something went wrong';

  res.status(status).json({ error: message });
};