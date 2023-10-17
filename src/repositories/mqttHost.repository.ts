import { MqttHost } from "@/database/entities/mqttHost.entity";
import { Repository } from "typeorm";

class MqttHostRepository extends Repository<MqttHost> {}

export default MqttHostRepository;
