const { Client } = require("pg");
const config = require("./ormconfig");
const fs = require("fs");

const client = new Client({
  user: config.username,
  host: config.host,
  password: config.password,
  database: config.database,
  port: config.port,
});

async function main() {
  const now = new Date();

  client.connect();

  const orderItems = await client.query(`SELECT * FROM "order_item"`);
  const tableOrders = await client.query(`SELECT * FROM "table_order"`);
  const orders = await client.query(`SELECT * FROM "order"`);
  const tables = await client.query(`SELECT * FROM "table"`);
  const fnbs = await client.query(`SELECT * FROM "fnb"`);

  fs.writeFileSync(
    `./backup/${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}-order_item.json`,
    JSON.stringify(orderItems.rows),
  );

  fs.writeFileSync(
    `./backup/${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}-table_order.json`,
    JSON.stringify(tableOrders.rows),
  );

  fs.writeFileSync(
    `./backup/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-order.json`,
    JSON.stringify(orders.rows),
  );

  fs.writeFileSync(
    `./backup/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-table.json`,
    JSON.stringify(tables.rows),
  );

  fs.writeFileSync(
    `./backup/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-fnb.json`,
    JSON.stringify(fnbs.rows),
  );

  client.end();
}

main();
