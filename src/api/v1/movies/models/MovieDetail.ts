import { Expose } from 'class-transformer';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { Movie } from './Movie';

export class MovieDetail extends Movie {

  public constructor(values: {
    readonly code: string,
    readonly title: string,
    readonly description: string | undefined,
    readonly pictureUrls: string[],
    readonly rating: number,
    readonly releaseDate: Date,
    readonly lengthInMins: number
  }) {

    super(values);

    this.description = values.description?.trim() || '';
    this.lengthInMins = values.lengthInMins;
  }

  @Expose()
  @IsString()
  public readonly description: string;

  @Expose()
  @IsInt()
  @IsPositive()
  public readonly lengthInMins: number;
}
