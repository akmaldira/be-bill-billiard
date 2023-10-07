import { AppDataSource } from "@/database/datasource";
import { Fnb } from "@/database/entities/fnb.entity";
import { HttpException } from "@/exceptions/http.exception";
import { RequestWithUser } from "@/interfaces/route.interface";
import FnbRepository from "@/repositories/fnb.repository";
import {
  createFnbBodySpec,
  getFnbByIdParamsSpec,
  updateFnbBodySpec,
} from "@/validations/fnb.validation";
import { Response } from "express";
import { parse } from "valibot";

class FnbController {
  private fnbRepository: FnbRepository;

  constructor() {
    this.fnbRepository = new FnbRepository(
      Fnb,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public create = async (req: RequestWithUser, res: Response) => {
    const { image, name, price, stock, category } = parse(createFnbBodySpec, req.body);

    const fnb = await this.fnbRepository.save({
      image,
      name,
      price,
      stock,
      category,
    });

    res.status(201).json({
      error: false,
      data: fnb,
    });
  };

  public getAll = async (req: RequestWithUser, res: Response) => {
    const fnbs = await this.fnbRepository.find();

    res.status(200).json({
      error: false,
      data: fnbs,
    });
  };

  public getById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getFnbByIdParamsSpec, req.params);

    const fnb = await this.fnbRepository.findOne({ where: { id } });

    res.status(200).json({
      error: false,
      data: fnb,
    });
  };

  public updateById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getFnbByIdParamsSpec, req.params);
    const { image, name, price, stock, category, active } = parse(
      updateFnbBodySpec,
      req.body,
    );

    const fnb = await this.fnbRepository.findOne({ where: { id } });

    if (!fnb) {
      throw new HttpException(400, "Fnb tidak ditemukan", "FNB_NOT_FOUND");
    }

    fnb.image = image;
    fnb.name = name;
    fnb.price = price;
    fnb.stock = stock;
    fnb.category = category;
    fnb.active = active;

    await this.fnbRepository.save(fnb);

    res.status(200).json({
      error: false,
      data: fnb,
    });
  };

  public deleteById = async (req: RequestWithUser, res: Response) => {
    const { id } = parse(getFnbByIdParamsSpec, req.params);

    await this.fnbRepository.softDelete({ id });

    res.status(200).json({
      error: false,
    });
  };
}

export default FnbController;
