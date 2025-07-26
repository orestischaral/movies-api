import { RequestHandler } from "express";
import { validateApiKey } from "./apiKeyMiddleware";

export function withApiKeyProtection(
  handler: RequestHandler
): RequestHandler[] {
  return [validateApiKey, handler];
}
