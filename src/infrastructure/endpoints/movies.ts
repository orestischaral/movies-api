import { Router, Request, Response } from "express";
import { Movie } from "../../domain/model/Movie";
import { withApiKeyProtection } from "../auth_utils/withApiKeyProtection";
import prisma from "../db/prismaDbConnector";
import GetPopularMovies from "../../application/UseCases/getPopularMovies";
import SearchMovies from "../../application/UseCases/searchMovies";
import MovieRepository from "../repositories/movieRepository";
const router = Router();

// GET /movies/popular?page=1
router.get(
  "/popular",
  ...withApiKeyProtection(async (req: Request, res: Response) => {
    try {
      const page: number | undefined = ({} = parseInt(
        req.query.page as string
      ));
      const pageSize = page ? 10 : 50;
      const useCase = new GetPopularMovies(new MovieRepository(prisma));
      const movies = await useCase.execute(page, pageSize);

      const response = movies.map((movie: Movie) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.releaseDate,
        posterUrl: movie.posterUrl,
        rating: movie.rating,
      }));

      res.json(response);
    } catch (err) {
      console.error("Error fetching popular movies:", err);
      res.status(500).json({ error: "Failed to retrieve popular movies" });
    }
  })
);

router.get(
  "/search",
  ...withApiKeyProtection(async (req, res) => {
    const query = req.query.query as string;
    const sortBy = (req.query.sort_by as "rating" | "release_date") || "rating";
    const filter = req.query.filter as string | undefined;
    const page: number | undefined = ({} = parseInt(req.query.page as string));

    if (!query) {
      return res
        .status(400)
        .json({ error: "Missing required query parameter: query" });
    }

    const { genre, year } = parseFilter(req.query.filter as string | undefined);
    const useCase = new SearchMovies(new MovieRepository(prisma));
    const results = await useCase.execute(
      query,
      sortBy,
      page,
      genre,
      year?.toString()
    );

    res.json(
      results.map((m: Movie) => ({
        id: m.id,
        title: m.title,
        releaseDate: m.releaseDate,
        posterUrl: m.posterUrl,
        rating: m.rating,
      }))
    );
  })
);

function parseFilter(filterStr?: string): { genre?: string; year?: number } {
  const result: { genre?: string; year?: number } = {};

  if (!filterStr) return result;

  const filters = filterStr.split(","); // e.g., ['genre:Action', 'year:2020']

  for (const pair of filters) {
    const [key, value] = pair.split(":");

    if (key === "genre") result.genre = value;
    if (key === "year") result.year = parseInt(value);
  }
  return result;
}
export default router;
