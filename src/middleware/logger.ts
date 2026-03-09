import type { Request, Response, NextFunction } from "express";
import { logger, writeHttpLog, HttpLogEntry, logError } from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const route = req.originalUrl || req.url;

  logger.debug({ msg: "request_start", method: req.method, route });

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const diffMs = Number(end - start) / 1_000_000;

    const entry: HttpLogEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      route,
      status: res.statusCode,
      responseTimeMs: diffMs,
    };

    const level =
      res.statusCode >= 500
        ? "error"
        : res.statusCode >= 400
          ? "warn"
          : "info";

    writeHttpLog(level, entry);
    logger[level]({
      msg: "request_end",
      ...entry,
    });
  });

  next();
}

export function errorLogger(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logError(err, {
    status: 500,
  });

  res.status(500).json({
    error: "Internal Server Error",
  });
}
