import { TableOrder } from "@/database/entities/tableOrder.entity";
import { Repository } from "typeorm";

class TableOrderRepository extends Repository<TableOrder> {}

export default TableOrderRepository;
