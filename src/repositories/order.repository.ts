import { Order } from "@/database/entities/order.entity";
import { Repository } from "typeorm";

class OrderRepository extends Repository<Order> {}

export default OrderRepository;
