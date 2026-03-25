import type { Request, Response } from "express";
import { findStrainByNormalizedName, getAllStrains } from "../services/strain.service";

export class StrainsController {
  static getAll(_req: Request, res: Response) {
    const strains = getAllStrains();
    res.json(strains);
  }

  static matchByName(req: Request, res: Response) {
    const input = typeof req.query.name === "string" ? req.query.name : "";
    if (!input.trim()) {
      res.status(400).json({
        error: "Missing required query param: name",
        example: "/api/v1/strains/match?name=Purple%20mimosa",
      });
      return;
    }

    const match = findStrainByNormalizedName(input);
    if (!match) {
      res.status(404).json({ match: null });
      return;
    }

    res.json(match);
  }
}
