import type { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key = req.ip || (req.headers["x-forwarded-for"] as string) || "global";
    await rateLimiter.consume(key);
    next();
  } catch {
    res.status(429).json({
      error: "Too Many Requests",
    });
  }
}
