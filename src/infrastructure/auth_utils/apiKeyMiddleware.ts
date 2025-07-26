import { Request, Response, NextFunction } from "express";

export function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const encodedKeys =
    process.env.ENCODED_API_KEYS?.split(",").map((k) => k.trim()) || [];
  const incomingKey = req.query.api_key as string;

  if (!incomingKey || !encodedKeys.includes(incomingKey)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}
