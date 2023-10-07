import { SECRET_KEY } from "@config";
import { UserRole } from "@database/entities/user.entity";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import { NextFunction } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

const hasRole =
  (roles: UserRole[]) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authorization =
        req.cookies["Authorization"] ||
        (req.header("Authorization")
          ? req.header("Authorization")!.split("Bearer ")[1]
          : null);

      if (!authorization)
        next(new HttpException(401, "Token tidak ditemukan", "TOKEN_NOT_FOUND"));

      const secretKey: string = SECRET_KEY!;
      verify(authorization, secretKey, (err: any, user: any) => {
        if (err) {
          if (err instanceof TokenExpiredError)
            return next(
              new HttpException(401, "Token autentikasi kadaluarsa", "TOKEN_EXPIRED"),
            );
          next(new HttpException(401, "Token autentikasi salah", "TOKEN_INVALID"));
        }
        if (!roles.includes(user.role))
          next(
            new HttpException(
              403,
              "Anda tidak memiliki akses untuk fitur ini",
              "FORBIDDEN",
            ),
          );

        req.user = user;
        next();
      });
    } catch (error) {
      next(new HttpException(401, "Token autentikasi salah", "TOKEN_INVALID"));
    }
  };

export default hasRole;
