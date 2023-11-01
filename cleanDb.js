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
  client.connect();

  const orderItems = await client.query(`SELECT * FROM "order_item"`);
  const tableOrders = await client.query(`SELECT * FROM "table_order"`);
  const orders = await client.query(`SELECT * FROM "order"`);
  const tables = await client.query(`SELECT * FROM "table"`);
  const fnbs = await client.query(`SELECT * FROM "fnb"`);

  fs.writeFileSync("./backup/order_item.json", JSON.stringify(orderItems.rows));

  fs.writeFileSync("./backup/table_order.json", JSON.stringify(tableOrders.rows));

  fs.writeFileSync("./backup/order.json", JSON.stringify(orders.rows));

  fs.writeFileSync("./backup/table.json", JSON.stringify(tables.rows));

  fs.writeFileSync("./backup/fnb.json", JSON.stringify(fnbs.rows));

  await client.query(`DELETE FROM "order_item"`);
  await client.query(`DELETE FROM "table_order"`);
  await client.query(`DELETE FROM "order"`);
  await client.query(`DELETE FROM "table"`);
  await client.query(`DELETE FROM "fnb"`);

  client.end();
}

main();
