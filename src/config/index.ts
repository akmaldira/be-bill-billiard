import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV || "development";

export const LOG_FORMAT = NODE_ENV === "development" ? "dev" : "combined";

config({ path: `.env${NODE_ENV == "development" ? ".development" : ""}` });

export const { PORT, SECRET_KEY, MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY } = process.env;
