import { array, number, object, optional, string } from "valibot";

export const createFnbBodySpec = object({
  fnb_id: number("Fnb ID harus angka"),
  quantity: number("Quantity harus angka"),
});

export const createTableBodySpec = object({
  table_id: number("Table ID harus angka"),
  duration: number("Duration harus angka"),
});

export const createOrderBodySpec = object({
  costumer_name: string("Costumer name harus string"),
  table_order: optional(createTableBodySpec),
  order_items: array(createFnbBodySpec),
});
