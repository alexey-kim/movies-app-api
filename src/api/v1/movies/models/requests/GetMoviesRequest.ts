import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';
import { Constants } from '../../../../../constants';
import { Locale, Locales } from '../../../../../localisation/types/Locale';
import { OrderByDir } from '../../../../../types/OrderByDir';
import { equalsAnyCase } from '../../../../../utils/checkUtils';
import { PaginatedRequest } from '../../../models/PaginatedRequest';
import { MovieOrderBy, MovieOrderBys } from '../../types/MovieOrderBy';
import { Movie } from '../Movie';

export class GetMoviesRequest extends PaginatedRequest<Movie, MovieOrderBy> {

  public constructor(
    pageIndex: number | string | undefined,
    pageSize: number | string | undefined,
    orderBy: MovieOrderBy | undefined,
    orderByDir: OrderByDir | undefined,
    locale: Locale) {

    // If orderBy is not provided then order by rating in descending order
    super(pageIndex, pageSize, orderBy ? orderByDir : Constants.ORDER_BY_DIR.DESC);
    this.orderBy = orderBy ? MovieOrderBys.find((validOrderBy: keyof Movie) => equalsAnyCase(validOrderBy, orderBy))! : 'rating';
    this.locale = locale;
  }

  @Expose()
  @IsIn([...MovieOrderBys])
  public readonly orderBy: MovieOrderBy;

  @Expose()
  @IsIn([...Locales])
  public readonly locale: Locale;
}
