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

/**
 * @openapi
 * /api/v1/strains/match:
 *   get:
 *     summary: Match a strain by normalized name/AKA
 *     description: >
 *       Normalization is lowercase + remove all whitespace.
 *       Matches against `name` and all `akas`.
 *     tags:
 *       - Strains
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: Purple mimosa
 *     responses:
 *       200:
 *         description: Matching strain object.
 *       404:
 *         description: No match found.
 */
router.get("/strains/match", StrainsController.matchByName);

export default router;
