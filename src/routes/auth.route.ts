import AuthController from "@controllers/auth.controller";
import { IRoutes } from "@interfaces/route.interface";
import { tryCatch } from "@utils/tryCatch";
import { Router } from "express";

class AuthRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new AuthController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/login`, tryCatch(this.controller.login));
    this.router.post(`${this.path}/register`, tryCatch(this.controller.register));
  }
}

export default AuthRoute;
