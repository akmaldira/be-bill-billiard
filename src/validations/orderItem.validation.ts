import { object, string } from "valibot";

export const processOrderItemParamsSpec = object({
  id: string("ID Harus string"),
});
