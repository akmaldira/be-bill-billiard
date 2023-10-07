import { DataSource, DataSourceOptions } from "typeorm";
const ormconfig = require("../../ormconfig");

export const AppDataSource = new DataSource(ormconfig as DataSourceOptions);
