import { User } from "@database/entities/user.entity";

export const registerResponseSpec = (user: User) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

export const loginResponseSpec = (user: User, token: string) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  token,
});
