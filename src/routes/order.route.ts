import OrderController from "@/controllers/order.controller";
import { UserRole } from "@/database/entities/user.entity";
import { IRoutes } from "@/interfaces/route.interface";
import hasRole from "@/middlewares/role.middleware";
import { tryCatch } from "@/utils/tryCatch";
import { Router } from "express";

class OrderRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new OrderController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.create),
    );
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.cashier, UserRole.chef]) as any,
      tryCatch(this.controller.getAll),
    );
    this.router.get(
      `${this.path}/:id`,
      hasRole([UserRole.admin, UserRole.cashier, UserRole.chef]) as any,
      tryCatch(this.controller.getById),
    );
    this.router.patch(
      `${this.path}/:id`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.paid),
    );
  }
}

export default OrderRoute;
