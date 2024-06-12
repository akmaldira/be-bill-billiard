import { boolean, coerce, number, object, optional, string } from "valibot";

export const createTableBodySpec = object({
  name: string("Nama harus string"),
  price: number("Harga harus angka"),
  device_id: string("Device ID harus string"),
});

export const updateTableBodySpec = object({
  name: string("Nama harus string"),
  price: number("Harga harus angka"),
  price_each_minutes: optional(number("Harga per menit harus angka")),
  device_id: string("Device ID harus string"),
  active: boolean("Active harus boolean"),
});

export const getTableByIdParamsSpec = object({
  id: coerce(number("ID Harus angka"), Number),
});
