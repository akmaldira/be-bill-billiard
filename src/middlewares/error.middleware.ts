import { HttpException } from "@exceptions/http.exception";
import { logger } from "@utils/logger";
import { NextFunction, Request, Response } from "express";
import { ValiError } from "valibot";

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
    );
    logger.error(error.stack);

    if (error instanceof ValiError) {
      return res.status(400).json({
        error: true,
        errorKey: "API_ERROR_" + error.message.split(" ")[0].toUpperCase(),
        message: error.message,
      });
    }

    res.status(status).json({ error: true, errorKey: error.errorKey, message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
