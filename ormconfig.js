const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Akmaldira123",
  database: "bill-billiard",
  synchronize: false,
  logging: false,
  entities: [
    NODE_ENV === "production"
      ? "./dist/database/**/*.entity.js"
      : "./src/database/**/*.entity.ts",
  ],
  migrations: ["./migrations/*.js"],
  migrationsTableName: "migrations",
};

// module.exports = {
//   type: "postgres",
//   host: "containers-us-west-186.railway.app",
//   port: 5521,
//   username: "postgres",
//   password: "kOnYN2xOwjvedDhHhBuV",
//   database: "railway",
//   synchronize: false,
//   logging: false,
//   entities: [
//     NODE_ENV === "production"
//       ? "./dist/database/**/*.entity.js"
//       : "./src/database/**/*.entity.ts",
//   ],
//   migrations: ["./migrations/*.js"],
//   migrationsTableName: "migrations",
// };
