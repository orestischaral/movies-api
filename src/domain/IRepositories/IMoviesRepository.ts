import { Movie } from "../model/Movie";

export default interface IMovieRepository {
  getPopularMovies(limit?: number, skip?: number): Promise<Movie[]>;
  searchMoviesInDb(
    query: string,
    sortBy: "rating" | "release_date",
    genreFilter?: string,
    yearFilter?: string,
    skip?: number,
    take?: number
  ): Promise<Movie[]>;
  getMovieById(id: number): Promise<Movie | null>;
}
