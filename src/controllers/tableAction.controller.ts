import { PRICE_PER_MINUTES } from "@/config";
import { AppDataSource } from "@/database/datasource";
import { Fnb } from "@/database/entities/fnb.entity";
import { Order } from "@/database/entities/order.entity";
import { OrderFnb } from "@/database/entities/orderFnb.entity";
import { Table } from "@/database/entities/table.entity";
import { TableOrder } from "@/database/entities/tableOrder.entity";
import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/route.interface";
import FnbRepository from "@/repositories/fnb.repository";
import OrderRepository from "@/repositories/order.repository";
import OrderFnbRepository from "@/repositories/orderFnb.repository";
import TableRepository from "@/repositories/table.repository";
import TableOrderRepository from "@/repositories/tableOrder.repository";
import { getMinutesBetweenDates } from "@/utils/utils";
import {
  addDurationBodySpec,
  stopTableParamsSpec,
  stopTableReasonQuerySpec,
  updateOrderFnbBodySpec,
} from "@/validations/tableAction.validation";
import { Response } from "express";
import { parse } from "valibot";

class TableActionController {
  private tableRepository: TableRepository;
  private orderItemsRepository: OrderFnbRepository;
  private tableOrderRepository: TableOrderRepository;
  private orderRepository: OrderRepository;
  private fnbRepository: FnbRepository;

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
    this.orderItemsRepository = new OrderFnbRepository(
      OrderFnb,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.orderRepository = new OrderRepository(
      Order,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.fnbRepository = new FnbRepository(
      Fnb,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public stop = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(stopTableParamsSpec, req.params);
    const { reason } = parse(stopTableReasonQuerySpec, req.query);

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

    orderTable.stoped_at = reason == "done" ? undefined : stoped_at;
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

  public updateOrderFnb = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(stopTableParamsSpec, req.params);
    const { order_items } = parse(updateOrderFnbBodySpec, req.body);

    const tableOrder = await this.tableOrderRepository.findOne({
      where: { table: { id } },
      relations: ["order", "order.order_items", "order.order_items.fnb"],
    });

    if (!tableOrder)
      throw new HttpException(404, "Tidak ada order di meja ini", "ORDER_NOT_FOUND");

    const fnbs = await this.fnbRepository.find();

    tableOrder.order.order_items.map(orderItem => {
      tableOrder.order.price -= orderItem.quantity * orderItem.fnb.price;
    });

    await AppDataSource.transaction(async transactionEntityManager => {
      // update price
      await transactionEntityManager.remove(OrderFnb, tableOrder.order.order_items);
      await transactionEntityManager.save(Order, tableOrder.order);

      // update order items
      const orderItems = order_items.map(orderItem => {
        const fnb = fnbs.find(fnb => fnb.id === orderItem.fnb_id);
        if (!fnb) {
          throw new HttpException(404, "Fnb tidak ditemukan", "FNB_NOT_FOUND");
        }
        tableOrder.order.price += orderItem.quantity * fnb.price;
        return this.orderItemsRepository.create({
          order_id: tableOrder.order.id,
          fnb_id: orderItem.fnb_id,
          order: tableOrder.order,
          fnb,
          quantity: orderItem.quantity,
        });
      });

      await transactionEntityManager.save(Order, tableOrder.order);
      await transactionEntityManager.save(OrderFnb, orderItems);
    });

    res.status(200).json({
      error: false,
      data: "OK",
    });
  };
}

export default TableActionController;
