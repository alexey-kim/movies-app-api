import { prop } from '@typegoose/typegoose';
import { Constants } from '../../../../constants';
import { Localised } from '../../../../database/decorators/Localised';
import { IDatabaseOrdering } from '../../../../database/interfaces/IDatabaseOrdering';
import { flattenDatabaseOrderings } from '../../../../database/utils/databaseUtils';
import { Locale } from '../../../../localisation/types/Locale';
import { BaseSerialisable } from '../../../../serialisation/BaseSerialisable';
import { OrderByDir } from '../../../../types/OrderByDir';
import { nonExhaustiveSwitchCase } from '../../../../utils/checkUtils';
import { Movie } from '../models/Movie';
import { MovieDetail } from '../models/MovieDetail';
import { MovieOrderBy } from '../types/MovieOrderBy';

export class MovieEntity extends BaseSerialisable {

  /*
   * Use this constructor to create instances manually, e.g. for seeding or testing
   * Mongoose will not call it.
   */
  public constructor(values: {
    readonly code: string,
    readonly titles: Map<Locale, string>,
    readonly descriptions: Map<Locale, string>,
    readonly pictureUrlCsvs: Map<Locale, string>,
    readonly rating: number,
    readonly releaseDate: Date,
    readonly lengthInMins: number
  }) {

    super();

    this.code = values.code;
    this.titles = values.titles;
    this.descriptions = values.descriptions;
    this.pictureUrlCsvs = values.pictureUrlCsvs;
    this.rating = values.rating;
    this.releaseDate = values.releaseDate;
    this.lengthInMins = values.lengthInMins;
  }

  @prop({ required: true })
  public readonly code: string;

  @prop({ required: true, type: () => String })
  @Localised()
  public readonly titles: Map<Locale, string>;

  @prop({ required: true, type: () => String })
  @Localised()
  public readonly descriptions: Map<Locale, string>;

  @prop({ required: true, type: () => String })
  @Localised()
  public readonly pictureUrlCsvs: Map<Locale, string>;

  @prop({ required: true })
  public readonly rating: number;

  @prop({ required: true, type: () => Date })
  public readonly releaseDate: Date;

  @prop({ required: true })
  public readonly lengthInMins: number;

  public static toDatabaseMovieOrderBy(clientOrderBy: MovieOrderBy, orderByDir: OrderByDir, locale: Locale): string {

    const databaseOrderings: Array<IDatabaseOrdering<MovieEntity>> = [];

    // Add secondary orderBys to resolve any potential ties from the first orderBy
    // e.g. if there are multiple movies with the same rating, etc.
    switch (clientOrderBy) {
      case 'title': {
        databaseOrderings.push(
          {
            orderBy: 'titles',
            orderByDir,
            locale
          },
          {
            orderBy: 'titles',
            orderByDir,
            locale: Constants.DEFAULTS.LOCALE
          });
        break;
      }
      case 'rating': {
        databaseOrderings.push(
          {
            orderBy: 'rating',
            orderByDir,
            locale
          },
          {
            orderBy: 'titles',
            orderByDir: Constants.ORDER_BY_DIR.ASC,
            locale
          },
          {
            orderBy: 'titles',
            orderByDir: Constants.ORDER_BY_DIR.ASC,
            locale: Constants.DEFAULTS.LOCALE
          });
        break;
      }
      case 'releaseDate': {
        databaseOrderings.push(
          {
            orderBy: 'releaseDate',
            orderByDir,
            locale
          },
          {
            orderBy: 'rating',
            orderByDir: Constants.ORDER_BY_DIR.DESC,
            locale
          },
          {
            orderBy: 'titles',
            orderByDir: Constants.ORDER_BY_DIR.ASC,
            locale
          },
          {
            orderBy: 'titles',
            orderByDir: Constants.ORDER_BY_DIR.ASC,
            locale: Constants.DEFAULTS.LOCALE
          });
        break;
      }
      default: nonExhaustiveSwitchCase(clientOrderBy);
    }

    return flattenDatabaseOrderings(MovieEntity, databaseOrderings);
  }

  private _toTitle(locale: Locale): string {
    return this.titles.get(locale) ?? this.titles.get(Constants.DEFAULTS.LOCALE) ?? '';
  }

  private _toDescription(locale: Locale): string | undefined {
    return this.descriptions.get(locale) ?? this.descriptions.get(Constants.DEFAULTS.LOCALE);
  }

  private _toPictureUrls(locale: Locale): string[] {
    return (this.pictureUrlCsvs.get(locale) ?? this.pictureUrlCsvs.get(Constants.DEFAULTS.LOCALE) ?? '').split(/\s*,\s*/);
  }

  public toMovie(locale: Locale): Movie {
    return new Movie({
      code: this.code,
      title: this._toTitle(locale),
      pictureUrls: this._toPictureUrls(locale),
      rating: this.rating,
      releaseDate: this.releaseDate
    });
  }

  public toMovieDetail(locale: Locale): MovieDetail {
    return new MovieDetail({
      code: this.code,
      title: this._toTitle(locale),
      description: this._toDescription(locale),
      pictureUrls: this._toPictureUrls(locale),
      rating: this.rating,
      releaseDate: this.releaseDate,
      lengthInMins: this.lengthInMins
    });
  }
}
