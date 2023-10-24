import DashboardController from "@/controllers/dashboard.controller";
import { UserRole } from "@/database/entities/user.entity";
import { IRoutes } from "@/interfaces/route.interface";
import hasRole from "@/middlewares/role.middleware";
import { tryCatch } from "@/utils/tryCatch";
import { Router } from "express";

class DashboardRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new DashboardController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.index),
    );
  }
}

export default DashboardRoute;
