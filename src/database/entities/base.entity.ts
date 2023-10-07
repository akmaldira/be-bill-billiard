import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", select: false })
  deleted_at: Date;
}
