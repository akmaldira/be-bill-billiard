import { array, coerce, number, object, optional, string } from "valibot";

export const stopTableParamsSpec = object({
  id: coerce(number("ID Harus angka"), Number),
});

export const addDurationBodySpec = object({
  duration: coerce(number("Durasi harus angka"), Number),
});

export const updateOrderFnbBodySpec = object({
  order_items: array(
    object({
      id: optional(string("ID harus string")),
      fnb_id: number("ID Harus angka"),
      quantity: number("Quantity harus angka"),
      fnb: optional(
        object({
          price: number("Price harus angka"),
        }),
      ),
    }),
    "Order item harus array",
  ),
});
