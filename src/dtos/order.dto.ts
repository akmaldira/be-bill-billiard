import { Order } from "@/database/entities/order.entity";

export const orderResponseSpec = (orders: Order) => ({
  id: orders.id,
  costumer_name: orders.costumer_name,
  paid: orders.paid,
  price: orders.price,
  note: orders.note,
  created_by: orders.created_by.name,
  created_at: orders.created_at,
  table: !orders.table_order ? null : orders.table_order.used_table.name,
  duration: !orders.table_order ? null : orders.table_order.duration,
  life_time: orders.table_order?.life_time,
  order_items: orders.order_items.map(orderItem => ({
    id: orderItem.id,
    fnb: orderItem.fnb.name,
    quantity: orderItem.quantity,
  })),
});
