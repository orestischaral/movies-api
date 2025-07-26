import { prisma } from "../../infrastructure/db/prismaDbConnector";
import MovieRepository from "../../infrastructure/repositories/movieRepository";
import GetMovieByIdUseCase from "./getMovieByIdUseCase";
import { Movie } from "../../domain/model/Movie";

describe("Integration: GetMovieByIdUseCase", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const repo = new MovieRepository(prisma);
  const useCase = new GetMovieByIdUseCase(repo);

  it("returns a movie when the ID exists", async () => {
    const popular = await repo.getPopularMovies(1, 0);
    const id = popular[0].id;

    const result = await useCase.execute(id);

    expect(result).toBeInstanceOf(Movie);
    expect(result?.id).toBe(id);
    expect(typeof result?.title).toBe("string");
  });

  it("returns null when the ID does not exist", async () => {
    const result = await useCase.execute(99999999); // unlikely ID

    expect(result).toBeNull();
  });
});
