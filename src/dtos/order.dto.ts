import { Order } from "@/database/entities/order.entity";

export const orderResponseSpec = (order: Order) => ({
  id: order.id,
  costumer_name: order.costumer_name,
  paid: order.paid,
  price: order.price,
  note: order.note,
  created_by: order.created_by.name,
  created_at: order.created_at,
  table: !order.table_order ? null : order.table_order.used_table.name,
  duration: !order.table_order ? null : order.table_order.duration,
  life_time: order.table_order?.life_time,
  order_items: order.order_items.map(orderItem => ({
    id: orderItem.id,
    fnb: orderItem.fnb.name,
    quantity: orderItem.quantity,
  })),
  stopped: order.table_order?.table ? false : true,
});
