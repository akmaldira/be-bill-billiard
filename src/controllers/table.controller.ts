import { AppDataSource } from "@/database/datasource";
import { Table } from "@/database/entities/table.entity";
import { tableResponseSpec } from "@/dtos/table.dto";
import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/route.interface";
import TableRepository from "@/repositories/table.repository";
import {
  createTableBodySpec,
  getTableByIdParamsSpec,
  updateTableBodySpec,
} from "@/validations/table.validation";
import { Response } from "express";
import { parse } from "valibot";

class TableController {
  private tableRepository: TableRepository;

  constructor() {
    this.tableRepository = new TableRepository(
      Table,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public create = async (req: RequestWithUser, res: Response) => {
    const { name, price, device_id } = parse(createTableBodySpec, req.body);

    const table = await this.tableRepository.save({
      name,
      price,
      device_id,
    });

    res.status(201).json({
      error: false,
      data: table,
    });
  };

  public getAll = async (req: RequestWithUser, res: Response) => {
    const tables = await this.tableRepository.find({
      relations: [
        "order",
        "order.order",
        "order.order.order_items",
        "order.order.order_items.fnb",
      ],
    });

    res.status(200).json({
      error: false,
      data: tables.map(table => tableResponseSpec(table)),
    });
  };

  public getById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getTableByIdParamsSpec, req.params);

    const table = await this.tableRepository.findOne({ where: { id } });

    res.status(200).json({
      error: false,
      data: table,
    });
  };

  public updateById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getTableByIdParamsSpec, req.params);
    const { name, price, device_id, active } = parse(updateTableBodySpec, req.body);

    const table = await this.tableRepository.findOne({ where: { id } });

    if (!table) {
      throw new HttpException(400, "Meja tidak ditemukan", "TABLE_NOT_FOUND");
    }

    table.name = name;
    table.price = price;
    table.device_id = device_id;
    table.active = active;

    await this.tableRepository.save(table);

    res.status(200).json({
      error: false,
      data: table,
    });
  };

  public deleteById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getTableByIdParamsSpec, req.params);

    await this.tableRepository.softDelete({ id });

    res.status(200).json({
      error: false,
    });
  };
}

export default TableController;
