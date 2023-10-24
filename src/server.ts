import App from "@/app";
import "reflect-metadata";
import AuthRoute from "./routes/auth.route";
import DashboardRoute from "./routes/dashboard.route";
import FnbRoute from "./routes/fnb.route";
import MqttHostRoute from "./routes/mqttHost.route";
import OrderRoute from "./routes/order.route";
import OrderItemRoute from "./routes/orderItem.route";
import TableRoute from "./routes/table.route";
import TableActionRoute from "./routes/tableAction.route";
import UserRoute from "./routes/user.route";

const app = new App([
  new AuthRoute("/auth"),
  new DashboardRoute("/dashboard"),
  new TableRoute("/table"),
  new TableActionRoute("/table-action"),
  new FnbRoute("/fnb"),
  new UserRoute("/user"),
  new OrderRoute("/order"),
  new OrderItemRoute("/order-item"),
  new MqttHostRoute("/mqtt-host"),
]);

app.listen();
