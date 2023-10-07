import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderFnb } from "./orderFnb.entity";
import { TableOrder } from "./tableOrder.entity";
import { User } from "./user.entity";

@Entity({ schema: "public", name: "order" })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  costumer_name: string;

  @Column({ default: false })
  paid: boolean;

  @Column()
  price: number;

  @Column({ nullable: true })
  note: string;

  // Relational
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: "created_by_id" })
  created_by: Relation<User>;

  @OneToOne(() => TableOrder, tableOrder => tableOrder.order, { nullable: true })
  table_order: Relation<TableOrder>;

  @OneToMany(() => OrderFnb, orderItem => orderItem.order)
  order_items: Relation<OrderFnb>[];
}
