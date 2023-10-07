import { AppDataSource } from "@/database/datasource";
import { User } from "@/database/entities/user.entity";
import { RequestWithUser } from "@/interfaces/route.interface";
import UserRepository from "@/repositories/user.repository";
import {
  createUserBodySpec,
  getUserByIdParamsSpec,
  updateUserBodySpec,
} from "@/validations/user.validation";
import { hash } from "bcrypt";
import { Response } from "express";
import { parse } from "valibot";

class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(
      User,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public getAll = async (req: RequestWithUser, res: Response) => {
    const users = await this.userRepository.find();

    res.status(200).json({
      error: false,
      data: users,
    });
  };

  public getById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getUserByIdParamsSpec, req.params);

    const user = await this.userRepository.findOne({ where: { id } });

    res.status(200).json({
      error: false,
      data: user,
    });
  };

  public create = async (req: RequestWithUser, res: Response) => {
    const { name, email, password, role } = parse(createUserBodySpec, req.body);

    const passwordHash = await hash(password, 10);

    const user = await this.userRepository.save({
      name,
      email,
      password: passwordHash,
      role,
    });

    res.status(201).json({
      error: false,
      data: user,
    });
  };

  public updateById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getUserByIdParamsSpec, req.params);

    const { name, email, role } = parse(updateUserBodySpec, req.body);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await this.userRepository.save(user);

    res.status(200).json({
      error: false,
      data: user,
    });
  };

  public deleteById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getUserByIdParamsSpec, req.params);

    await this.userRepository.softDelete({ id });

    res.status(200).json({
      error: false,
    });
  };
}

export default UserController;
