import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { TableOrder } from "./tableOrder.entity";

@Entity({ schema: "public", name: "table" })
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  device_id: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 583 })
  price_each_minutes: number;

  @OneToOne(() => TableOrder, tableOrder => tableOrder.table, { nullable: true })
  order: Relation<TableOrder>;

  @OneToMany(() => TableOrder, tableOrder => tableOrder.used_table)
  table_orders: Relation<TableOrder>[];
}
