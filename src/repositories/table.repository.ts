import { Table } from "@/database/entities/table.entity";
import { Repository } from "typeorm";

class TableRepository extends Repository<Table> {}

export default TableRepository;
