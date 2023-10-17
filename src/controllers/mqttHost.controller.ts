import { AppDataSource } from "@/database/datasource";
import { MqttHost } from "@/database/entities/mqttHost.entity";
import { RequestWithUser } from "@/interfaces/route.interface";
import MqttHostRepository from "@/repositories/mqttHost.repository";
import { Response } from "express";

class MqttHostController {
  private mqttHostRepository: MqttHostRepository;

  constructor() {
    this.mqttHostRepository = new MqttHostRepository(
      MqttHost,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public getOne = async (req: RequestWithUser, res: Response) => {
    const mqttHost = await this.mqttHostRepository.find();

    res.status(200).json({
      error: false,
      data: mqttHost.length > 0 ? mqttHost[0] : null,
    });
  };
}

export default MqttHostController;
