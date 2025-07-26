import { validateApiKey } from "./apiKeyMiddleware"; // adjust path as needed
import crypto from "crypto";

describe("validateApiKey middleware", () => {
  const originalEnv = process.env;

  const createMockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("calls next() for a valid API key", () => {
    const validKey = "test-key";
    const validHash = crypto
      .createHash("sha256")
      .update(validKey)
      .digest("hex");
    process.env.HASHED_API_KEYS = validHash;

    const req = {
      query: { api_key: validKey },
    } as any;

    const res = createMockRes();
    const next = jest.fn();

    validateApiKey(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 401 for an invalid API key", () => {
    const validHash = crypto
      .createHash("sha256")
      .update("test-key")
      .digest("hex");
    process.env.HASHED_API_KEYS = validHash;

    const req = {
      query: { api_key: "wrong-key" },
    } as any;

    const res = createMockRes();
    const next = jest.fn();

    validateApiKey(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or missing API key",
    });
  });

  it("returns 401 if API key is missing", () => {
    process.env.HASHED_API_KEYS = crypto
      .createHash("sha256")
      .update("any-key")
      .digest("hex");

    const req = {
      query: {},
    } as any;

    const res = createMockRes();
    const next = jest.fn();

    validateApiKey(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or missing API key",
    });
  });
});
