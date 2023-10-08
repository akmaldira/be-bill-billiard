import App from "@/app";
import "reflect-metadata";
import AuthRoute from "./routes/auth.route";
import FnbRoute from "./routes/fnb.route";
import OrderRoute from "./routes/order.route";
import OrderItemRoute from "./routes/orderItem.route";
import TableRoute from "./routes/table.route";
import TableActionRoute from "./routes/tableAction.route";
import UserRoute from "./routes/user.route";

const app = new App([
  new AuthRoute("/api/auth"),
  new TableRoute("/api/table"),
  new TableActionRoute("/api/table-action"),
  new FnbRoute("/api/fnb"),
  new UserRoute("/api/user"),
  new OrderRoute("/api/order"),
  new OrderItemRoute("/api/order-item"),
]);

app.listen();
