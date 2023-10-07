import TableController from "@/controllers/table.controller";
import { UserRole } from "@/database/entities/user.entity";
import { IRoutes } from "@/interfaces/route.interface";
import hasRole from "@/middlewares/role.middleware";
import { tryCatch } from "@/utils/tryCatch";
import { Router } from "express";

class TableRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new TableController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.cashier]) as any,
      tryCatch(this.controller.getAll),
    );
    this.router.get(
      `${this.path}/:id`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.getById),
    );
    this.router.post(
      `${this.path}`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.create),
    );
    this.router.put(
      `${this.path}/:id`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.updateById),
    );
    this.router.delete(
      `${this.path}/:id`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.deleteById),
    );
  }
}

export default TableRoute;
