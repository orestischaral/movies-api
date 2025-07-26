import repository from "./movieRepository";
import { Movie } from "../../domain/model/Movie";
import MovieRepository from "./movieRepository";

jest.mock("../db/prismaDbConnector", () =>
  require("../db/__mocks__/prisma.ts")
);

const mockData = [
  {
    id: 1,
    title: "Mock Movie",
    releaseDate: new Date("2020-01-01"),
    posterUrl: "http://example.com/poster.jpg",
    fullPosterUrl: null,
    overview: null,
    rating: 9.0,
    runtime: null,
    language: "en",
    genres: [{ genre: { name: "Action" } }],
  },
];

describe("getPopularMovies", () => {
  it("should return a list of Movie instances", async () => {
    const { prisma } = require("../db/__mocks__/prisma.ts");
    prisma.movie.findMany.mockResolvedValue(mockData);
    const repo = new MovieRepository(prisma);
    const movies = await repo.getPopularMovies(undefined, 0);

    expect(movies.length).toBe(1);
    expect(movies[0]).toBeInstanceOf(Movie);
    expect(movies[0].title).toBe("Mock Movie");
  });

  it("should apply orderBy rating desc, limit and skip", async () => {
    const { prisma } = require("../db/__mocks__/prisma.ts");
    const repo = new MovieRepository(prisma);

    await repo.getPopularMovies(5, 10);

    expect(prisma.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { rating: "desc" },
        take: 5,
        skip: 10,
      })
    );
  });
});
