import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV || "development";

export const LOG_FORMAT = NODE_ENV === "development" ? "dev" : "tiny";

config({ path: `.env${NODE_ENV == "development" ? ".development" : ""}` });

export const { PORT, SECRET_KEY, MQTT_PROTOCOL, MQTT_HOST } = process.env;

export const PRICE_PER_MINUTES = Number(process.env.PRICE_PER_MINUTES) || 583;

export const MQTT_PORT = Number(process.env.MQTT_PORT) || 1883;
