import { prisma } from "../../infrastructure/db/prismaDbConnector";
import { Movie } from "../../domain/model/Movie";
import GetPopularMovies from "./getPopularMovies";
import MovieRepository from "../../infrastructure/repositories/movieRepository";

describe("Integration: getPopularMovies Use Case", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns paginated movies ordered by rating desc", async () => {
    const page = 1;
    const pageSize = 10;
    const useCase = new GetPopularMovies(new MovieRepository(prisma));
    const movies = await useCase.execute(page, pageSize);

    expect(Array.isArray(movies)).toBe(true);
    expect(movies.length).toBeLessThanOrEqual(10);

    expect(movies[0]).toBeInstanceOf(Movie);

    const ratings = movies.map((m: any) => m.rating ?? 0);
    const sorted = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sorted);
  });
});
