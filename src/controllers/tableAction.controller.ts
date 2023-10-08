import { PRICE_PER_MINUTES } from "@/config";
import { AppDataSource } from "@/database/datasource";
import { Order } from "@/database/entities/order.entity";
import { Table } from "@/database/entities/table.entity";
import { TableOrder } from "@/database/entities/tableOrder.entity";
import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/route.interface";
import OrderRepository from "@/repositories/order.repository";
import TableRepository from "@/repositories/table.repository";
import TableOrderRepository from "@/repositories/tableOrder.repository";
import { getMinutesBetweenDates } from "@/utils/utils";
import {
  addDurationBodySpec,
  stopTableParamsSpec,
} from "@/validations/tableAction.validation";
import { Response } from "express";
import { parse } from "valibot";

class TableActionController {
  private tableRepository: TableRepository;
  private tableOrderRepository: TableOrderRepository;
  private orderRepository: OrderRepository;

  constructor() {
    this.tableRepository = new TableRepository(
      Table,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.tableOrderRepository = new TableOrderRepository(
      TableOrder,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.orderRepository = new OrderRepository(
      Order,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public stop = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(stopTableParamsSpec, req.params);

    const orderTable = await this.tableOrderRepository.findOne({
      where: { table: { id } },
      relations: ["order"],
    });

    if (!orderTable) {
      return res.status(200).json({
        error: false,
        data: "OK",
      });
    }

    const stoped_at = new Date();

    orderTable.stoped_at = stoped_at;
    orderTable.table = null!;

    if (orderTable.life_time) {
      const minutes = getMinutesBetweenDates(orderTable.order.created_at, stoped_at);
      orderTable.duration = minutes;
      orderTable.order.price += Math.floor(minutes * PRICE_PER_MINUTES);
    }

    await AppDataSource.transaction(async transactionEntityManager => {
      await transactionEntityManager.save(TableOrder, orderTable);
      await transactionEntityManager.save(Order, orderTable.order);
    });

    res.status(200).json({
      error: false,
      data: "OK",
    });
  };

  public addDuration = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(stopTableParamsSpec, req.params);
    const { duration } = parse(addDurationBodySpec, req.body);

    const tableOrder = await this.tableOrderRepository.findOne({
      where: { table: { id } },
      relations: ["order", "used_table"],
    });

    if (!tableOrder)
      throw new HttpException(404, "Tidak ada order di meja ini", "ORDER_NOT_FOUND");

    if (tableOrder.life_time)
      throw new HttpException(400, "Meja ini bermain sepuasnya", "TABLE_NO_DURATION");

    tableOrder.duration += duration;

    tableOrder.order.price += duration * tableOrder.used_table.price;

    await AppDataSource.transaction(async transactionEntityManager => {
      await transactionEntityManager.save(TableOrder, tableOrder);
      await transactionEntityManager.save(Order, tableOrder.order);
    });

    res.status(200).json({
      error: false,
      data: "OK",
    });
  };
}

export default TableActionController;
