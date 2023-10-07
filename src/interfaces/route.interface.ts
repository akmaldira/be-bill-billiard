import { Request, Router } from "express";
import { IUser } from "./user.interface";

export interface IRoutes {
  path: string;
  router: Router;
}

export interface RequestWithUser extends Request {
  user?: IUser;
}
