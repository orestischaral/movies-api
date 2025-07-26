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

describe("searchMoviesInDb", () => {
  const { prisma } = require("../db/__mocks__/prisma.ts");
  const repo = new MovieRepository(prisma);

  beforeEach(() => {
    prisma.movie.findMany.mockReset();
  });

  it("should match by title (case-insensitive)", async () => {
    prisma.movie.findMany.mockResolvedValue(mockData);

    const results = await repo.searchMoviesInDb("Mock", "rating");

    expect(results.length).toBe(1);
    expect(prisma.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: { contains: "Mock", mode: "insensitive" },
        }),
      })
    );
  });

  it("should apply genre filter correctly", async () => {
    prisma.movie.findMany.mockResolvedValue(mockData);

    await repo.searchMoviesInDb("Mock", "rating", "Action");

    expect(prisma.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          genres: {
            some: {
              genre: {
                name: {
                  equals: "Action",
                  mode: "insensitive",
                },
              },
            },
          },
        }),
      })
    );
  });

  it("should apply year filter correctly", async () => {
    prisma.movie.findMany.mockResolvedValue(mockData);

    await repo.searchMoviesInDb("Mock", "release_date", undefined, "2020");

    expect(prisma.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          releaseDate: {
            gte: new Date("2020-01-01T00:00:00.000Z"),
            lte: new Date("2020-12-31T23:59:59.999Z"),
          },
        }),
        orderBy: { releaseDate: "desc" },
      })
    );
  });

  it("should apply default skip and take", async () => {
    prisma.movie.findMany.mockResolvedValue(mockData);

    await repo.searchMoviesInDb("Mock", "rating");

    expect(prisma.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      })
    );
  });
});

describe("getMovieById", () => {
  const { prisma } = require("../db/__mocks__/prisma.ts");
  const repo = new MovieRepository(prisma);

  const mockMovie = {
    id: 1,
    title: "Mock Movie",
    releaseDate: new Date("2020-01-01"),
    posterUrl: "http://example.com/poster.jpg",
    fullPosterUrl: "http://example.com/full-poster.jpg",
    overview: "A test movie",
    rating: 8.5,
    runtime: 120,
    language: "en",
    genres: [{ genre: { name: "Action" } }],
  };

  beforeEach(() => {
    prisma.movie.findUnique.mockReset();
  });

  it("should return a Movie instance when found", async () => {
    prisma.movie.findUnique.mockResolvedValue(mockMovie);

    const result = await repo.getMovieById(1);

    expect(prisma.movie.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { genres: { include: { genre: true } } },
    });

    expect(result).toBeInstanceOf(Movie);
    expect(result?.title).toBe("Mock Movie");
    expect(result?.genres).toContain("Action");
  });

  it("should return null if movie not found", async () => {
    prisma.movie.findUnique.mockResolvedValue(null);

    const result = await repo.getMovieById(9999);

    expect(prisma.movie.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 9999 } })
    );
    expect(result).toBeNull();
  });
});
