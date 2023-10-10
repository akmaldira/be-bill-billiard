import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Order } from "./order.entity";
import { Table } from "./table.entity";

@Entity({ schema: "public", name: "table_order" })
export class TableOrder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  duration: number; // in minutes

  @Column({ nullable: true })
  stoped_at?: Date;

  @ManyToOne(() => Table, table => table.table_orders)
  @JoinColumn({ name: "used_table_id" })
  used_table: Relation<Table>;

  @Column({ default: false })
  life_time: boolean;

  @OneToOne(() => Table, table => table.order)
  @JoinColumn({ name: "table_id" })
  table?: Relation<Table>;

  @OneToOne(() => Order, order => order.table_order)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>;

  @AfterLoad()
  afterLoad() {
    this.duration /= 60;
  }

  @BeforeInsert()
  @BeforeUpdate()
  beforeInsert() {
    if (!this.life_time) this.duration *= 60;
  }
}
