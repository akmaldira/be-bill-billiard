import { AppDataSource } from "@/database/datasource";
import { Table } from "@/database/entities/table.entity";
import { TableOrder } from "@/database/entities/tableOrder.entity";
import { RequestWithUser } from "@/interfaces/route.interface";
import TableRepository from "@/repositories/table.repository";
import TableOrderRepository from "@/repositories/tableOrder.repository";
import { stopTableParamsSpec } from "@/validations/tableAction.validation";
import { Response } from "express";
import { parse } from "valibot";

class TableActionController {
  private tableRepository: TableRepository;
  private tableOrderRepository: TableOrderRepository;

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

    await this.tableOrderRepository.update(
      { table: { id } },
      { used_table: { id }, table: { id: undefined } },
    );

    res.status(200).json({
      error: false,
      data: "OK",
    });
  };
}

export default TableActionController;
