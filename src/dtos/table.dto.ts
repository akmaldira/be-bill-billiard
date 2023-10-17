import { Table } from "@/database/entities/table.entity";

export const tableResponseSpec = (table: Table) => ({
  id: table.id,
  name: table.name,
  price: table.price,
  device_id: table.device_id,
  active: table.active,
  order: table.order
    ? {
        created_at: table.order?.order?.created_at,
        costumer_name: table.order?.order?.costumer_name,
        duration: table.order?.duration,
        life_time: table.order?.life_time,
        price: table.order?.order?.price,
        order_items: table.order?.order?.order_items?.map(orderItem => ({
          id: orderItem.id,
          quantity: orderItem.quantity,
          status: orderItem.status,
          fnb: orderItem.fnb
            ? {
                name: orderItem.fnb.name,
                price: orderItem.fnb.price,
                category: orderItem.fnb.category,
              }
            : null,
        })),
      }
    : null,
});
