import fs from "fs";
import path from "path";
import { StrainArraySchema, Strain } from "../schemas/strain.schema";
import { logger, logError } from "../utils/logger";

let strainsCache: Strain[] | null = null;

function loadStrainsFromDisk(): Strain[] {
  const dataPath = path.join(__dirname, "..", "..", "assets", "data.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw);

  const data = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.strains)
      ? parsed.strains
      : Array.isArray(parsed.filtered_strains)
        ? parsed.filtered_strains
        : (() => {
            throw new Error("Unexpected data.json format");
          })();

  const validated = StrainArraySchema.parse(data);
  logger.info({ msg: "Loaded strains data", count: validated.length });
  return validated;
}

export function getAllStrains(): Strain[] {
  if (!strainsCache) {
    try {
      strainsCache = loadStrainsFromDisk();
    } catch (error) {
      logError(error, { scope: "loadStrainsFromDisk" });
      throw error;
    }
  }
  return strainsCache;
}

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "string[]"
  | "number[]"
  | "boolean[]";

export function getFieldTypes(): Record<string, FieldType> {
  const all = getAllStrains();
  const fieldTypes: Record<string, FieldType> = {};
  const invalidKeys = new Set<string>();

  for (const strain of all) {
    for (const [key, value] of Object.entries(strain)) {
      if (value === null) continue;
      if (invalidKeys.has(key)) continue;

      if (Array.isArray(value)) {
        const first = value[0];
        if (typeof first === "string") {
          fieldTypes[key] = "string[]";
        } else if (typeof first === "number") {
          fieldTypes[key] = "number[]";
        } else if (typeof first === "boolean") {
          fieldTypes[key] = "boolean[]";
        } else if (first !== undefined) {
          // Mixed / unsupported array element type – drop this key entirely.
          delete fieldTypes[key];
          invalidKeys.add(key);
        }
      } else if (typeof value === "string") {
        fieldTypes[key] = "string";
      } else if (typeof value === "number") {
        fieldTypes[key] = "number";
      } else if (typeof value === "boolean") {
        fieldTypes[key] = "boolean";
      } else {
        // Object or any other unsupported shape – ensure this key is never exposed.
        delete fieldTypes[key];
        invalidKeys.add(key);
      }
    }
  }

  return fieldTypes;
}
