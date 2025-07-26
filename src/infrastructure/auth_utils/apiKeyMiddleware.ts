import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function isValidKey(rawKey: string): boolean {
  const allowed = (process.env.HASHED_API_KEYS || "")
    .split(",")
    .map((k) => k.trim());
  const incomingHash = hashApiKey(rawKey);
  return allowed.some((storedHash) =>
    crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(incomingHash))
  );
}

export function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.query.api_key as string;
  if (!apiKey || !isValidKey(apiKey)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}
