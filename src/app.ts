import express from "express";
import cors from "cors";

import healthRouter from "./infrastructure/endpoints/health";
import moviesRouter from "./infrastructure/endpoints/movies";

const app = express();
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Movie API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 2rem;
          background-color: #f9f9f9;
        }
        h1 {
          color: #333;
        }
        p {
          color: #555;
          margin-bottom: 1.5rem;
        }
        code {
          background: #eee;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <h1>🎬 Welcome to the Movie API</h1>
      <p>This API allows you to access and search movie data.</p>
      <p>Example endpoints:</p>
      <p><code>GET /movies/popular?api_key=your-key</code></p>
      <p><code>GET /movies/search?query=Inception&api_key=your-key</code></p>
      <p><code>GET /movies/1?api_key=your-key</code></p>
    </body>
    </html>
  `);
});
app.use("/health", healthRouter);
app.use("/movies", moviesRouter);
app.use(cors());
app.use(express.json());

app.use((req, res) => res.status(404).json({ error: "Not found" }));

export default app;
