import TableActionController from "@/controllers/tableAction.controller";
import { UserRole } from "@/database/entities/user.entity";
import { IRoutes } from "@/interfaces/route.interface";
import hasRole from "@/middlewares/role.middleware";
import { tryCatch } from "@/utils/tryCatch";
import { Router } from "express";

class TableActionRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new TableActionController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(
      `${this.path}/stop/:id`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.stop),
    );
    this.router.put(
      `${this.path}/add-duration/:id`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.addDuration),
    );
    this.router.patch(
      `${this.path}/edit-fnb/:id`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.updateOrderFnb),
    );
    this.router.get(
      `${this.path}/reminder/:id`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.createReminder),
    );
  }
}

export default TableActionRoute;
