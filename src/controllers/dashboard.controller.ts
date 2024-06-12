import { AppDataSource } from "@/database/datasource";
import { Order } from "@/database/entities/order.entity";
import { User } from "@/database/entities/user.entity";
import { RequestWithUser } from "@/interfaces/route.interface";
import OrderRepository from "@/repositories/order.repository";
import UserRepository from "@/repositories/user.repository";
import { getDayName, getMonthName, getWeekName } from "@/utils/utils";
import { addDays, endOfYear, startOfYear } from "date-fns";
import { Response } from "express";
import { Between, IsNull } from "typeorm";

class DashboardController {
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;

  constructor() {
    this.orderRepository = new OrderRepository(
      Order,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.userRepository = new UserRepository(
      User,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public index = async (req: RequestWithUser, res: Response) => {
    let { from, to } = req.query as any;

    if (!from) {
      from = startOfYear(new Date());
    } else {
      from = addDays(new Date(from), 1);
    }

    if (!to) {
      to = endOfYear(new Date());
    } else {
      to = addDays(new Date(to), 1);
    }

    const groupOrders: any[] = [];

    const paidGroup = await this.orderRepository.groupByMonth(from, to, true);
    paidGroup.forEach((groupOrder: any) => {
      groupOrders.push({
        month: addDays(groupOrder.month, 1),
        total_paid_order_table: parseFloat(groupOrder.total_order_table),
        total_paid_order_item: parseFloat(groupOrder.total_order_item),
        total_paid_price: parseFloat(
          groupOrder.total_order_table + groupOrder.total_order_item,
        ),
      });
    });

    const unpaidGroup = await this.orderRepository.groupByMonth(from, to, false);
    unpaidGroup.forEach((groupOrder: any) => {
      const month = addDays(groupOrder.month, 1);
      const group = groupOrders.find(group => group.month.getTime() === month.getTime());
      if (group) {
        group.total_unpaid_order_table = parseFloat(groupOrder.total_order_table);
        group.total_unpaid_order_item = parseFloat(groupOrder.total_order_item);
        group.total_unpaid_price = parseFloat(
          groupOrder.total_order_table + groupOrder.total_order_item,
        );
      } else {
        groupOrders.push({
          month,
          total_unpaid_order_table: parseFloat(groupOrder.total_order_table),
          total_unpaid_order_item: parseFloat(groupOrder.total_order_item),
          total_unpaid_price: parseFloat(
            groupOrder.total_order_table + groupOrder.total_order_item,
          ),
        });
      }
    });

    const paidOrders = await this.orderRepository.find({
      where: { paid: true, deleted_at: IsNull(), created_at: Between(from, to) },
      relations: [
        "table_order",
        "table_order.used_table",
        "order_items",
        "order_items.fnb",
      ],
    });

    const unPaidOrders = await this.orderRepository.find({
      where: { paid: false, deleted_at: IsNull(), created_at: Between(from, to) },
      relations: [
        "table_order",
        "table_order.used_table",
        "order_items",
        "order_items.fnb",
      ],
    });

    const users = await this.userRepository
      .createQueryBuilder("user")
      .select("count(user.role)", "count")
      .addSelect("user.role", "role")
      .groupBy("user.role")
      .getRawMany();

    res.status(200).json({
      error: false,
      data: {
        groupOrders: groupOrders.sort((a, b) => a.month.getTime() - b.month.getTime()),
        paidOrders,
        unPaidOrders,
        users,
      },
    });
  };

  public report = async (req: RequestWithUser, res: Response) => {
    let { type } = req.query as any;
    type = type.toLowerCase() as "daily" | "weekly" | "monthly" | undefined;
    if (!type) {
      type = "daily";
    }

    switch (type) {
      case "daily":
        type = "day";
        break;
      case "weekly":
        type = "week";
        break;
      case "monthly":
        type = "month";
        break;
      default:
        type = "day";
        break;
    }

    const report = await this.orderRepository.getReport(type);

    const result = report.map(item => ({
      label:
        type == "day"
          ? getDayName(new Date(item.label))
          : type == "week"
          ? getWeekName(new Date(item.label))
          : getMonthName(new Date(item.label)),
      total_price: Number(item.total_order_item) + Number(item.total_order_table),
      total_order_item: item.total_order_item,
      total_order_table: item.total_order_table,
    }));

    res.status(200).json({
      error: false,
      data: result,
    });
  };
}

export default DashboardController;
