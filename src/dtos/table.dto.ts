import { Table } from "@/database/entities/table.entity";

export const tableResponseSpec = (table: Table) => ({
  id: table.id,
  name: table.name,
  price: table.price,
  device_id: table.device_id,
  order: table.order
    ? {
        created_at: table.order?.order?.created_at,
        duration: table.order?.duration,
        life_time: table.order?.life_time,
        price: table.order?.order?.price,
        order_items: table.order?.order?.order_items?.map(orderItem => ({
          id: orderItem.id,
          quantity: orderItem.quantity,
          status: orderItem.status,
          fnb: {
            name: orderItem.fnb.name,
            price: orderItem.fnb.price,
            category: orderItem.fnb.category,
          },
        })),
      }
    : null,
});
