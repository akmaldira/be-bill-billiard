import { coerce, number, object } from "valibot";

export const stopTableParamsSpec = object({
  id: coerce(number("ID Harus angka"), Number),
});
