import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Order } from "./order.entity";

export enum UserRole {
  "admin" = "admin",
  "cashier" = "cashier",
  "chef" = "chef",
  "user" = "user",
}

@Entity({ schema: "public", name: "user" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: [UserRole.cashier],
  })
  role: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  // Relational
  @OneToMany(() => Order, order => order.created_by)
  orders: Relation<Order>[];
}
