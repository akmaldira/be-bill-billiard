import OrderItemController from "@/controllers/orderItem.controller";
import { UserRole } from "@/database/entities/user.entity";
import { IRoutes } from "@/interfaces/route.interface";
import hasRole from "@/middlewares/role.middleware";
import { Router } from "express";

class OrderItemRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new OrderItemController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.chef]) as any,
      this.controller.getAll,
    );
    this.router.post(
      `${this.path}/:id/process`,
      hasRole([UserRole.admin, UserRole.chef]) as any,
      this.controller.processOrderItem,
    );
    this.router.post(
      `${this.path}/:id/finish`,
      hasRole([UserRole.admin, UserRole.chef]) as any,
      this.controller.finishOrderItem,
    );
  }
}

export default OrderItemRoute;
