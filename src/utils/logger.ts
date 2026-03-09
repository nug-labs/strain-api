import fs from "fs";
import path from "path";
import pino from "pino";

const LOG_DIR = path.join(__dirname, "..", "..", "logs");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

ensureLogDir();

type LogLevel = "info" | "warn" | "error" | "debug";

const fileStreams: Record<LogLevel, fs.WriteStream> = {
  info: fs.createWriteStream(path.join(LOG_DIR, "info.log"), { flags: "a" }),
  warn: fs.createWriteStream(path.join(LOG_DIR, "warn.log"), { flags: "a" }),
  error: fs.createWriteStream(path.join(LOG_DIR, "error.log"), { flags: "a" }),
  debug: fs.createWriteStream(path.join(LOG_DIR, "debug.log"), { flags: "a" }),
};

export const logger = pino({
  level: "info",
});

export interface HttpLogEntry {
  timestamp: string;
  method: string;
  route: string;
  status: number;
  responseTimeMs: number;
}

export function writeHttpLog(level: LogLevel, entry: HttpLogEntry) {
  const stream = fileStreams[level] ?? fileStreams.info;
  stream.write(JSON.stringify(entry) + "\n");
}

export function logError(error: unknown, context?: Record<string, unknown>) {
  const normalizedError =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: String(error) };

  const payload = {
    timestamp: new Date().toISOString(),
    level: "error",
    ...context,
    error: normalizedError,
  };

  fileStreams.error.write(JSON.stringify(payload) + "\n");
  logger.error(payload);
}
