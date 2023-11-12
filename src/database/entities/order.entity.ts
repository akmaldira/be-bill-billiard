import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { AppDataSource } from "../datasource";
import { BaseEntity } from "./base.entity";
import { Fnb } from "./fnb.entity";
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
  note?: string;

  @Column({ default: false })
  is_notified: boolean;

  // Relational
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: "created_by_id" })
  created_by: Relation<User>;

  @OneToOne(() => TableOrder, tableOrder => tableOrder.order, { nullable: true })
  table_order: Relation<TableOrder>;

  @OneToMany(() => OrderFnb, orderItem => orderItem.order)
  order_items: Relation<OrderFnb>[];

  @BeforeUpdate()
  async beforeUpdate() {
    // Paid condition
    if (this.paid) {
      const updatedFnb = this.order_items.map(orderItem => {
        return {
          id: orderItem.fnb.id,
          stock: orderItem.fnb.stock - orderItem.quantity,
        };
      });
      await AppDataSource.manager.save(Fnb, updatedFnb);
    }
  }
}
