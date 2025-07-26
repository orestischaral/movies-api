import IMovieRepository from "../../domain/IRepositories/IMoviesRepository";
import { Movie } from "../../domain/model/Movie";

export default class MovieRepository implements IMovieRepository {
  constructor(private readonly prisma: any) {}

  async getPopularMovies(limit = 50, skip = 0): Promise<Movie[]> {
    const movies = await this.prisma.movie.findMany({
      orderBy: { rating: "desc" },
      take: limit,
      skip: skip,
      select: {
        id: true,
        title: true,
        releaseDate: true,
        posterUrl: true,
        rating: true,
      },
    });

    return movies.map(
      (m: any) =>
        new Movie(m.id, {
          title: m.title,
          releaseDate: m.releaseDate,
          posterUrl: m.posterUrl,
          rating: m.rating,
        })
    );
  }

  async searchMoviesInDb(
    query: string,
    sortBy: "rating" | "release_date",
    genreFilter?: string,
    yearFilter?: string,
    skip = 0,
    take = 10
  ): Promise<Movie[]> {
    const where: any = {
      title: {
        contains: query,
        mode: "insensitive",
      },
    };

    if (genreFilter) {
      where.genres = {
        some: {
          genre: {
            name: {
              equals: genreFilter,
              mode: "insensitive",
            },
          },
        },
      };
    }
    if (yearFilter) {
      where.releaseDate = {
        gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
        lte: new Date(`${yearFilter}-12-31T23:59:59.999Z`),
      };
    }
    const movies = await this.prisma.movie.findMany({
      where,
      orderBy:
        sortBy === "rating" ? { rating: "desc" } : { releaseDate: "desc" },
      skip,
      take,
      include: {
        genres: {
          include: { genre: true },
        },
      },
    });

    return movies.map(
      (m: any) =>
        new Movie(m.id, {
          title: m.title,
          releaseDate: m.releaseDate,
          posterUrl: m.posterUrl,
          rating: m.rating,
          genres: m.genres.map((g: any) => g.genre.name),
        })
    );
  }

  async getMovieById(id: number): Promise<Movie | null> {
    const m = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!m) return null;

    return new Movie(m.id, {
      title: m.title,
      releaseDate: m.releaseDate,
      posterUrl: m.posterUrl,
      fullPosterUrl: m.fullPosterUrl,
      overview: m.overview,
      rating: m.rating,
      runtime: m.runtime,
      language: m.language,
      genres: m.genres.map((g: any) => g.genre.name),
    });
  }
}
