import { UserRole } from "@/database/entities/user.entity";
import { Enum, enumType, object, string } from "valibot";

const userRoleEnum = Object.values(UserRole) as Enum<UserRole>;

export const createUserBodySpec = object({
  name: string("Nama harus string"),
  email: string("Email harus string"),
  password: string("Password harus string"),
  role: enumType(userRoleEnum, "Role harus salah satu dari admin, cashier, chef, user"),
});

export const updateUserBodySpec = object({
  name: string("Nama harus string"),
  email: string("Email harus string"),
  role: enumType(userRoleEnum, "Role harus salah satu dari admin, cashier, chef, user"),
});

export const getUserByIdParamsSpec = object({
  id: string("ID harus string"),
});
