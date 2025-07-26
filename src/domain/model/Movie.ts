export interface MovieProps {
  readonly title: string;
  readonly releaseDate?: Date | null;
  readonly posterUrl?: string | null;
  readonly fullPosterUrl?: string | null;
  readonly overview?: string | null;
  readonly rating?: number | null;
  readonly runtime?: number | null;
  readonly language?: string | null;
  readonly genres?: string[];
}

export class Movie {
  public readonly title: string;
  public readonly releaseDate?: Date | null;
  public readonly posterUrl?: string | null;
  public readonly fullPosterUrl?: string | null;
  public readonly overview?: string | null;
  public readonly rating?: number | null;
  public readonly runtime?: number | null;
  public readonly language?: string | null;
  public readonly genres?: string[];

  constructor(public readonly id: number, props: MovieProps) {
    this.title = props.title;
    this.releaseDate = props.releaseDate;
    this.posterUrl = props.posterUrl;
    this.fullPosterUrl = props.fullPosterUrl;
    this.overview = props.overview;
    this.rating = props.rating;
    this.runtime = props.runtime;
    this.language = props.language;
    this.genres = props.genres;
  }
}
