import { Movie } from "../../domain/model/Movie";
import IMovieRepository from "../../domain/IRepositories/IMoviesRepository";
export default class SearchMovies {
  constructor(private readonly moviesRepository: IMovieRepository) {}

  async execute(
    query: string,
    sortBy: "rating" | "release_date" = "rating",
    page: number | undefined,
    genreFilter?: string,
    yearFilter?: string,
    pageSize = 10
  ): Promise<Movie[]> {
    let skip = 0;
    if (page && typeof page === "number") {
      skip = (page - 1) * pageSize;
    }
    return this.moviesRepository.searchMoviesInDb(
      query,
      sortBy,
      genreFilter,
      yearFilter,
      skip,
      pageSize
    );
  }
}
