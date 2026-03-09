import type { Request, Response } from "express";
import { getAllStrains } from "../services/strain.service";

export class StrainsController {
  static getAll(_req: Request, res: Response) {
    const strains = getAllStrains();
    res.json(strains);
  }
}
