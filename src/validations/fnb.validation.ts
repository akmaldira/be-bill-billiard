import { FnbCategory } from "@/database/entities/fnb.entity";
import {
  Enum,
  boolean,
  coerce,
  enumType,
  number,
  object,
  optional,
  string,
} from "valibot";

const categoryEnum = Object.values(FnbCategory) as Enum<FnbCategory>;

export const createFnbBodySpec = object({
  image: optional(string()),
  name: string("Nama harus string"),
  price: number("Harga harus angka"),
  stock: number("Stock harus angka"),
  category: optional(
    enumType(categoryEnum, "Category harus salah satu dari food, beverage, atau other"),
  ),
});

export const updateFnbBodySpec = object({
  image: optional(string()),
  name: string("Nama harus string"),
  price: number("Harga harus angka"),
  stock: number("Stock harus angka"),
  category: enumType(
    categoryEnum,
    "Category harus salah satu dari food, beverage, atau other",
  ),
  active: boolean("Active harus boolean"),
});

export const getFnbByIdParamsSpec = object({
  id: coerce(number("ID Harus angka"), Number),
});
