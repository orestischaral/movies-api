import { prisma } from "../../infrastructure/db/prismaDbConnector";
import { Movie } from "../../domain/model/Movie";
import SearchMoviesUseCase from "./searchMovies";
import MovieRepository from "../../infrastructure/repositories/movieRepository";

describe("Integration: SearchMoviesUseCase", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const useCase = new SearchMoviesUseCase(new MovieRepository(prisma));

  it("returns results matching the title query", async () => {
    const results = await useCase.execute("Movie", "release_date", undefined);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toBeInstanceOf(Movie);
    expect(results[0].title.toLowerCase()).toContain("movie");
  });

  it("filters by genre", async () => {
    const results = await useCase.execute(
      "Movie",
      "rating",
      undefined,
      "Action"
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].genres).toContain("Action");
  });

  it("filters by year", async () => {
    const results = await useCase.execute(
      "Movie",
      "rating",
      undefined,
      undefined,
      "2015"
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].releaseDate?.getUTCFullYear()).toBe(2015);
  });
});
