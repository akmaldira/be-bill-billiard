import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "public", name: "mqtt_host" })
export class MqttHost {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  protocol: string;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;
}
