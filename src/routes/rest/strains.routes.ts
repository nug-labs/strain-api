import { Router } from "express";
import { StrainsController } from "../../controllers/strains.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/strains:
 *   get:
 *     summary: Get all strains
 *     tags:
 *       - Strains
 *     responses:
 *       200:
 *         description: List of strains.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties:
 *                   oneOf:
 *                     - type: string
 *                     - type: number
 *                     - type: boolean
 */
router.get("/strains", StrainsController.getAll);

export default router;
