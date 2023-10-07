import { LOG_FORMAT, NODE_ENV, PORT } from "@config";
import { AppDataSource } from "@database/datasource";
import { IRoutes } from "@interfaces/route.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

class App {
  public app: Application;
  public env: string;
  public port: string | number;

  constructor(routes: IRoutes[]) {
    this.app = express();
    this.env = NODE_ENV;
    this.port = PORT || 3000;

    logger.info("Running environment: " + this.env);
    logger.info("App initializing...");
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`App listening on http://localhost:${this.port}`);
    });
  }

  private async connectToDatabase(): Promise<void> {
    AppDataSource.initialize()
      .then(() => logger.info("Database connected"))
      .catch((err: any) => logger.error("Database error", err));
  }

  private initializeMiddlewares(): void {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: IRoutes[]): void {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}

export default App;
