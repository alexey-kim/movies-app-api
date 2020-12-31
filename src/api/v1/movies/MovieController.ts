import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, queryParam, request, requestParam } from 'inversify-express-utils';
import { OkNegotiatedContentResult } from 'inversify-express-utils/dts/results';
import { Constants } from '../../../constants';
import { IRequestWithAcceptsLanguages } from '../../../http/interfaces/IRequestWithAcceptsLanguages';
import { getLocale } from '../../../localisation/utils/localisationUtils';
import { OrderByDir } from '../../../types/OrderByDir';
import { PaginatedResponse } from '../models/PaginatedResponse';
import { IMovieService } from './interfaces/IMovieService';
import { Movie } from './models/Movie';
import { MovieDetail } from './models/MovieDetail';
import { GetMovieDetailByCodeRequest } from './models/requests/GetMovieDetailByCodeRequest';
import { GetMoviesRequest } from './models/requests/GetMoviesRequest';
import { MovieOrderBy } from './types/MovieOrderBy';

@controller('/api/v1/movies')
export class MovieController extends BaseHttpController {

  public constructor(

    @inject(Constants.DI.MOVIE_SERVICE_V1)
    private readonly _movieService: IMovieService) {

    super();
  }

  @httpGet('/')
  public async getMovies(
    @request() httpRequest: IRequestWithAcceptsLanguages,
    @queryParam(Constants.QUERY_PARAMS.PAGE_INDEX) pageIndex: string | undefined,
    @queryParam(Constants.QUERY_PARAMS.PAGE_SIZE) pageSize: string | undefined,
    @queryParam(Constants.QUERY_PARAMS.ORDER_BY) orderBy: MovieOrderBy | undefined,
    @queryParam(Constants.QUERY_PARAMS.ORDER_BY_DIR) orderByDir: OrderByDir | undefined
  ): Promise<OkNegotiatedContentResult<PaginatedResponse<Movie>>> {

    const getMoviesRequest: GetMoviesRequest = new GetMoviesRequest(pageIndex, pageSize, orderBy, orderByDir, getLocale(httpRequest.acceptsLanguages()));
    const movies: PaginatedResponse<Movie> = await this._movieService.getMovies(getMoviesRequest);
    return this.ok(movies);
  }

  @httpGet(`/:${Constants.REQUEST_PARAMS.CODE}`)
  public async getMovieDetailByCode(
    @request() httpRequest: IRequestWithAcceptsLanguages,
    @requestParam(Constants.REQUEST_PARAMS.CODE) code: string
  ): Promise<OkNegotiatedContentResult<MovieDetail>> {

    const getMovieDetailByCodeRequest: GetMovieDetailByCodeRequest = new GetMovieDetailByCodeRequest(code, getLocale(httpRequest.acceptsLanguages()));
    const movieDetail: MovieDetail = await this._movieService.getMovieDetailByCode(getMovieDetailByCodeRequest);
    return this.ok(movieDetail);
  }
}
