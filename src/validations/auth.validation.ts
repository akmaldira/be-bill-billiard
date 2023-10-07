import { email, maxLength, minLength, object, string } from "valibot";

export const registerBodySpec = object({
  email: string("Email harus string", [email("Email tidak valid")]),
  name: string("Nama harus string"),
  password: string("Password harus string", [
    minLength(8, "Password harus lebih dari 8 karakter"),
    maxLength(20, "Password harus kurang dari 20 karakter"),
  ]),
});

export const loginBodySpec = object({
  email: string("Email harus string", [email("Email tidak valid")]),
  password: string("Password harus string", [
    minLength(8, "Password harus lebih dari 8 karakter"),
    maxLength(20, "Password harus kurang dari 20 karakter"),
  ]),
});
