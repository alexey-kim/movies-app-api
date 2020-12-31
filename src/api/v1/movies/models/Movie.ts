import { Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsLowercase, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { BaseValidatable } from '../../../../validation/BaseValidatable';

export class Movie extends BaseValidatable {

  public constructor(values: {
    readonly code: string,
    readonly title: string,
    readonly pictureUrls: string[],
    readonly rating: number,
    readonly releaseDate: Date
  }) {

    super();

    this.code = values.code?.trim().toLowerCase();
    this.title = values.title?.trim();
    this.pictureUrls = values.pictureUrls?.map((pictureUrl: string) => pictureUrl?.trim()).filter((pictureUrl: string) => pictureUrl);
    this.rating = values.rating;
    this.releaseDate = values.releaseDate;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  public readonly code: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public readonly pictureUrls: string[];

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly rating: number;

  @Expose()
  @IsDate()
  @Type(() => Date)
  public readonly releaseDate: Date;
}
