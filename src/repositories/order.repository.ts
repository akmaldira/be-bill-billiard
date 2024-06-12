import { Order } from "@/database/entities/order.entity";
import { Repository } from "typeorm";

class OrderRepository extends Repository<Order> {
  public async groupByMonth(from: Date, to: Date, paid: boolean = true) {
    return await this.query(`
    select 
      DATE_TRUNC('month', o.created_at) as month,
        sum(case
          when tbl_o.price is null then 0
          else tbl_o.price
        end) as total_order_table,
        sum(case
          when oi.price is null then 0
          else oi.price
        end) as total_order_item
    from "order" o 
    left join (
        select tbl_o.order_id, 
      case 
        when tbl_o.life_time then tbl_o.duration * tbl.price_each_minutes
        else tbl_o.duration / 60 * tbl.price
      end as price 
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
    group by month
    `);
  }

  public async getReport(type: "day" | "week" | "month") {
    return (await this.query(`
    select 
      date_trunc('${type}', o.created_at) as label,
      sum(o.total_price_table) as total_order_table,
      sum(o.total_price_item) as total_order_item
    from 
      "order" o
    group by
      label
    order by
      label desc
    `)) as { label: string; total_order_table: number; total_order_item: number }[];
  }
}

export default OrderRepository;
