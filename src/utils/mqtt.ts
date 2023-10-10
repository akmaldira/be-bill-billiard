import { MQTT_HOST, MQTT_PORT, MQTT_PROTOCOL } from "@/config";
import { connectAsync } from "mqtt";
import { MqttClient } from "mqtt/types/lib/client";

const host = `${MQTT_PROTOCOL}://${MQTT_HOST}:${MQTT_PORT}`;

let client: MqttClient;

export async function connection() {
  try {
    if (client) {
      return client;
    }
    client = await connectAsync(host);
    if (client.connected) {
      return client;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
