import MqttHostController from "@/controllers/mqttHost.controller";
import { UserRole } from "@/database/entities/user.entity";
import { IRoutes } from "@/interfaces/route.interface";
import hasRole from "@/middlewares/role.middleware";
import { tryCatch } from "@/utils/tryCatch";
import { Router } from "express";

class MqttHostRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new MqttHostController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.cashier, UserRole.chef]) as any,
      tryCatch(this.controller.getOne),
    );
  }
}

export default MqttHostRoute;
