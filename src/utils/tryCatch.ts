import { NextFunction, Request, Response } from "express";

export const tryCatch = (
  fn: (req: Request, res: Response, next: NextFunction) => void,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
