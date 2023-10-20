import { AppDataSource } from "@/database/datasource";
import { OrderFnb, OrderItemStatus } from "@/database/entities/orderFnb.entity";
import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/route.interface";
import OrderFnbRepository from "@/repositories/orderFnb.repository";
import { processOrderItemParamsSpec } from "@/validations/orderItem.validation";
import { Response } from "express";
import { In } from "typeorm";
import { parse } from "valibot";

class OrderItemController {
  private orderItemRepository: OrderFnbRepository;

  constructor() {
    this.orderItemRepository = new OrderFnbRepository(
      OrderFnb,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public getAll = async (req: RequestWithUser, res: Response) => {
    const orderItems = await this.orderItemRepository.find({
      where: {
        status: In([OrderItemStatus.pending, OrderItemStatus.cooking]),
        fnb: {
          category: In(["food", "beverage"]),
        },
      },
      relations: ["fnb", "order"],
      order: {
        created_at: "ASC",
      },
    });
    res.status(200).json({ error: false, data: orderItems });
  };

  public processOrderItem = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(processOrderItemParamsSpec, req.params);

    const orderItem = await this.orderItemRepository.findOne({ where: { id } });

    if (!orderItem)
      throw new HttpException(404, "Order item not found", "ORDER_ITEM_NOT_FOUND");

    orderItem.status = OrderItemStatus.cooking;

    await this.orderItemRepository.save(orderItem);

    res.status(200).json({ error: false, data: "OK" });
  };

  public finishOrderItem = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(processOrderItemParamsSpec, req.params);

    const orderItem = await this.orderItemRepository.findOne({ where: { id } });

    if (!orderItem)
      throw new HttpException(404, "Order item not found", "ORDER_ITEM_NOT_FOUND");

    orderItem.status = OrderItemStatus.done;

    await this.orderItemRepository.save(orderItem);

    res.status(200).json({ error: false, data: "OK" });
  };
}

export default OrderItemController;
