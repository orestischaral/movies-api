import { validateApiKey } from "./apiKeyMiddleware";

describe("validateApiKey middleware", () => {
  const createMockRes = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res;
  };

  it("allows requests with a valid key", () => {
    process.env.ENCODED_API_KEYS = Buffer.from("Hola").toString("base64");
    const req = {
      query: { api_key: Buffer.from("Hola").toString("base64") },
    } as any;
    const res = createMockRes();
    const next = jest.fn();

    validateApiKey(req, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects requests with a missing key", () => {
    process.env.ENCODED_API_KEYS = Buffer.from("Hola").toString("base64");
    const req = { query: {} } as any;
    const res = createMockRes();
    const next = jest.fn();

    validateApiKey(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or missing API key",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects requests with an invalid key", () => {
    process.env.ENCODED_API_KEYS = Buffer.from("Hello").toString("base64");
    const req = { query: { api_key: "badkey123" } } as any;
    const res = createMockRes();
    const next = jest.fn();

    validateApiKey(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or missing API key",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
