import IMovieRepository from "../../domain/IRepositories/IMoviesRepository";
import { Movie } from "../../domain/model/Movie";

export default class GetMovieByIdUseCase {
  constructor(private readonly movieRepo: IMovieRepository) {}

  async execute(id: number): Promise<Movie | null> {
    return this.movieRepo.getMovieById(id);
  }
}
