import { SECRET_KEY } from "@config";
import { AppDataSource } from "@database/datasource";
import { User } from "@database/entities/user.entity";
import { registerResponseSpec } from "@dtos/auth.dto";
import { HttpException } from "@exceptions/http.exception";
import UserRepository from "@repositories/user.repository";
import { loginBodySpec, registerBodySpec } from "@validations/auth.validation";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { parse } from "valibot";

class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(
      User,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public login = async (req: Request, res: Response) => {
    loginBodySpec._parse(req.body);

    const user = await this.userRepository.getByEmail(req.body.email);

    this.checkIfUserExists(user);

    await this.checkIfPasswordMatch(req.body.password, user!.password);

    const token = await this.generateToken(user!);

    res.status(200).json({
      error: false,
      data: { id: user!.id, role: user!.role, token },
    });
  };

  public register = async (req: Request, res: Response) => {
    const { email, name, password } = parse(registerBodySpec, req.body);

    this.checkIfUserNotExists(await this.userRepository.getByEmail(email));

    const passwordHash = await this.hashPassword(password);

    const user = await this.userRepository.save({
      email,
      name,
      password: passwordHash,
    } as User);

    res.status(201).json({
      error: false,
      data: registerResponseSpec(user),
    });
  };

  private checkIfUserExists = (user: User | null): void => {
    if (!user) {
      throw new HttpException(400, "Email tidak terdaftar", "EMAIL_NOT_FOUND");
    }
  };

  private checkIfPasswordMatch = async (
    bodyPassword: string,
    userPassword: string,
  ): Promise<void> => {
    const match = await compare(bodyPassword, userPassword);
    if (!match) {
      throw new HttpException(400, "Password salah", "PASSWORD_NOT_MATCH");
    }
  };

  private checkIfUserNotExists = (user: User | null): void => {
    if (user) {
      throw new HttpException(400, "Email telah terdaftar", "EMAIL_EXISTS");
    }
  };

  private hashPassword = async (password: string): Promise<string> => {
    return await hash(password, 10);
  };

  private generateToken = async (user: User): Promise<string> => {
    const dataStoredInToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const secretKey: string = SECRET_KEY!;
    const expiresIn: number = 60 * 60 * 24 * 1;
    return sign(dataStoredInToken, secretKey, { expiresIn });
  };
}

export default AuthController;
