import { Fnb } from "@/database/entities/fnb.entity";
import { Repository } from "typeorm";

class FnbRepository extends Repository<Fnb> {}

export default FnbRepository;
