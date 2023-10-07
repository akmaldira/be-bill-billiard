import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderFnb } from "./orderFnb.entity";

export enum FnbCategory {
  "food" = "food",
  "beverage" = "beverage",
  "other" = "other",
}

@Entity({ schema: "public", name: "fnb" })
export class Fnb extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  image?: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({
    type: "enum",
    enum: FnbCategory,
    default: [FnbCategory.other],
  })
  category: FnbCategory;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => OrderFnb, orderItem => orderItem.fnb)
  order_items: Relation<OrderFnb>[];
}
