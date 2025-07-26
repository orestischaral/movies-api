import express from "express";
import cors from "cors";

import healthRouter from "./infrastructure/endpoints/health";
import moviesRouter from "./infrastructure/endpoints/movies";

const app = express();

app.use("/health", healthRouter);
app.use("/movies", moviesRouter);
app.use(cors());
app.use(express.json());

app.use((req, res) => res.status(404).json({ error: "Not found" }));

export default app;
