import { Router, Request, Response } from "express";

const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

export default healthRouter;
