import { AppDataSource } from "@/database/datasource";
import { Fnb } from "@/database/entities/fnb.entity";
import { Order } from "@/database/entities/order.entity";
import { OrderFnb } from "@/database/entities/orderFnb.entity";
import { Table } from "@/database/entities/table.entity";
import { TableOrder } from "@/database/entities/tableOrder.entity";
import { orderResponseSpec } from "@/dtos/order.dto";
import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/route.interface";
import FnbRepository from "@/repositories/fnb.repository";
import OrderRepository from "@/repositories/order.repository";
import OrderFnbRepository from "@/repositories/orderFnb.repository";
import TableRepository from "@/repositories/table.repository";
import TableOrderRepository from "@/repositories/tableOrder.repository";
import { connection } from "@/utils/mqtt";
import {
  createOrderBodySpec,
  getOrderByIdParamsSpec,
  paidOrderBodySpec,
} from "@/validations/order.validation";
import { Response } from "express";
import { In } from "typeorm";
import { v4 } from "uuid";
import { parse } from "valibot";

class OrderController {
  private orderRepository: OrderRepository;
  private orderItemRepository: OrderFnbRepository;
  private tableOrderRepository: TableOrderRepository;
  private tableRepository: TableRepository;
  private fnbRepository: FnbRepository;

  constructor() {
    this.orderRepository = new OrderRepository(
      Order,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.orderItemRepository = new OrderFnbRepository(
      OrderFnb,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.tableOrderRepository = new TableOrderRepository(
      TableOrder,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.tableRepository = new TableRepository(
      Table,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.fnbRepository = new FnbRepository(
      Fnb,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public create = async (req: RequestWithUser, res: Response) => {
    const { costumer_name, table_order, order_items } = parse(
      createOrderBodySpec,
      req.body,
    );
    const client = await connection();

    let totalPrice = 0;

    let tableOrder: TableOrder | null = null;
    let table: Table | null = null;

    if (table_order) {
      table = await this.tableRepository.findOne({
        where: { id: table_order.id },
        relations: ["order"],
      });
      if (!table)
        throw new HttpException(404, "Tabel tidak ditemukan", "TABLE_NOT_FOUND");

      if (table.order)
        throw new HttpException(400, "Table sedang digunakan", "TABLE_USED");

      if (table_order.duration > 0) {
        totalPrice += table_order.duration * table.price;
      }

      tableOrder = this.tableOrderRepository.create({
        duration: table_order.duration <= 0 ? 0 : table_order.duration,
        table: { id: table_order.id },
        used_table: { id: table_order.id },
        life_time: table_order.duration <= 0,
      });
    }

    const orderId = v4();
    const order = this.orderRepository.create({
      id: orderId,
      costumer_name,
      price: 0,
      created_by: req.user,
      table_order: tableOrder ?? undefined,
    });

    const orderItemsTemp: any[] = [];

    const fnbIds = order_items.map(orderItem => orderItem.id);
    const fnbs = await this.fnbRepository.findBy({ id: In(fnbIds) });

    order_items.forEach(orderItem => {
      const fnb = fnbs.find(fnb => fnb.id === orderItem.id);
      if (!fnb) {
        throw new HttpException(404, "Fnb tidak ditemukan", "FNB_NOT_FOUND");
      }

      totalPrice += orderItem.quantity * fnb.price;

      orderItemsTemp.push(
        this.orderItemRepository.create({
          order_id: orderId,
          fnb_id: orderItem.id,
          fnb,
          quantity: orderItem.quantity,
        }),
      );
    });

    await AppDataSource.transaction(
      "READ UNCOMMITTED",
      async transactionalEntityManager => {
        await transactionalEntityManager.save(Order, order);
        if (tableOrder) {
          const tableOrderSaved = await transactionalEntityManager.save(
            TableOrder,
            tableOrder,
          );
          order.table_order = tableOrderSaved;
        }

        const orderItems = await transactionalEntityManager.save(
          OrderFnb,
          orderItemsTemp,
        );

        order.order_items = orderItems;
        order.price = totalPrice;

        await transactionalEntityManager.save(Order, order);

        if (table) {
          client.publish("iot/meja", `meja${table.device_id}_on`);
        }
        client.publish("refresh", "true");
      },
    );

    return res.status(201).json({
      error: false,
      data: order,
    });
  };

  public paid = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getOrderByIdParamsSpec, req.params);
    const { note } = parse(paidOrderBodySpec, req.body);

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ["order_items", "table_order", "table_order.table", "order_items.fnb"],
    });

    if (!order) throw new HttpException(404, "Order tidak ditemukan", "ORDER_NOT_FOUND");

    if (order.paid) throw new HttpException(400, "Order sudah dibayar", "ORDER_PAID");

    if (order.table_order?.table)
      throw new HttpException(400, "Meja masih berlangsung", "ORDER_TABLE_USED");

    order.paid = true;
    order.note = note;

    await AppDataSource.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(Order, order);
    });

    res.status(200).json({
      error: false,
      data: "OK",
    });
  };

  public getAll = async (req: RequestWithUser, res: Response) => {
    const orders = await this.orderRepository.find({
      order: {
        created_at: "DESC",
      },
      relations: [
        "order_items",
        "order_items.fnb",
        "table_order",
        "table_order.table",
        "table_order.used_table",
        "created_by",
      ],
    });

    return res.status(200).json({
      error: false,
      data: orders.map(order => orderResponseSpec(order)),
    });
  };

  public getById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getOrderByIdParamsSpec, req.params);

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        "order_items",
        "order_items.fnb",
        "table_order",
        "table_order.table",
        "table_order.used_table",
        "created_by",
      ],
    });

    if (!order) throw new HttpException(404, "Order tidak ditemukan", "ORDER_NOT_FOUND");

    return res.status(200).json({
      error: false,
      data: orderResponseSpec(order),
    });
  };
}

export default OrderController;
