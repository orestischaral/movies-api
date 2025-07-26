import IMovieRepository from "../../domain/IRepositories/IMoviesRepository";

export default class GetPopularMovies {
  constructor(private readonly moviesRepository: IMovieRepository) {}

  async execute(page: number | undefined, pageSize = 10) {
    let skip = 0;
    if (page && typeof page === "number") {
      skip = (page - 1) * pageSize;
    }
    return this.moviesRepository.getPopularMovies(pageSize, skip);
  }
}
