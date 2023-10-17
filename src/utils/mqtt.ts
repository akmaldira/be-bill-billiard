import { USE_MQTT } from "@/config";
import { AppDataSource } from "@/database/datasource";
import { MqttHost } from "@/database/entities/mqttHost.entity";
import { connectAsync } from "mqtt";
import { MqttClient } from "mqtt/types/lib/client";

let client: MqttClient;

export async function connection() {
  try {
    const mqtts = await AppDataSource.manager.find(MqttHost);

    if (mqtts.length == 0) throw new Error("No MQTT Host found");

    const mqtt = mqtts[0];
    const MQTT_PROTOCOL = mqtt.protocol;
    const MQTT_HOST = mqtt.host;
    const MQTT_PORT = mqtt.port;

    const host = `${MQTT_PROTOCOL}://${MQTT_HOST}:${MQTT_PORT}`;
    if (!USE_MQTT) {
      return {
        publish: (topic: string, message: string) => {
          console.log("MQTT Client publish", topic, message);
        },
      };
    }
    if (client) {
      return client;
    }
    client = await connectAsync(host);
    if (client.connected) {
      return client;
    } else {
      throw new Error("MQTT Client error");
    }
  } catch (error) {
    throw new Error("MQTT Client error");
  }
}
