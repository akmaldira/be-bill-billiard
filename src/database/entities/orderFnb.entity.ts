import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Fnb } from "./fnb.entity";
import { Order } from "./order.entity";

export enum OrderItemStatus {
  "pending" = "pending",
  "cooking" = "cooking",
  "done" = "done",
  "canceled" = "canceled",
}

@Entity({ schema: "public", name: "order_item" })
export class OrderFnb {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  order_id: string;

  @Column()
  fnb_id: number;

  @Column()
  quantity: number;

  @Column({
    type: "enum",
    enum: OrderItemStatus,
    default: [OrderItemStatus.pending],
  })
  status: OrderItemStatus;

  @ManyToOne(() => Order, order => order.order_items)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>;

  @ManyToOne(() => Fnb, fnb => fnb.order_items)
  @JoinColumn({ name: "fnb_id" })
  fnb: Relation<Fnb>;
}
