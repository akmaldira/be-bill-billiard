import { Order } from "@/database/entities/order.entity";
import { Repository } from "typeorm";

class OrderRepository extends Repository<Order> {
  public async groupByMonth(from: Date, to: Date, paid: boolean = true) {
    return await this.query(`
    select DATE_TRUNC('month', o.created_at) as month, sum(o.price) as total_price,
      sum(tbl_o.price / 60) as total_order_table, sum(oi.price) as total_order_item
      from "order" o 
      left join (
        select tbl_o.order_id, tbl_o.duration * tbl.price as price
        from "table_order" tbl_o
        left join "table" tbl on tbl.id = tbl_o.used_table_id ) as tbl_o 
      on tbl_o.order_id = o.id
      left join (
        select oi.order_id, sum(oi.quantity * f.price) as price
        from order_item oi 
        left join fnb f on f.id = oi.fnb_id
        group by oi.order_id ) as oi
      on oi.order_id = o.id
      where o.deleted_at is null and o.paid = ${paid} and o.created_at between '${from.toISOString()}' and '${to.toISOString()}' 
      group by DATE_TRUNC('month', o.created_at)
    `);
  }
}

export default OrderRepository;
