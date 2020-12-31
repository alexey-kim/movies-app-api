import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Constants } from '../../../constants';
import { IDocument } from '../../../database/repositories/interfaces/IDocument';
import { IRepository } from '../../../database/repositories/interfaces/IRepository';
import { ExternalError } from '../../../errors/ExternalError';
import { isNullOrUndefined } from '../../../utils/checkUtils';
import { BaseService } from '../BaseService';
import { PaginatedResponse } from '../models/PaginatedResponse';
import { MovieEntity } from './entities/MovieEntity';
import { IMovieService } from './interfaces/IMovieService';
import { Movie } from './models/Movie';
import { MovieDetail } from './models/MovieDetail';
import { GetMovieDetailByCodeRequest } from './models/requests/GetMovieDetailByCodeRequest';
import { GetMoviesRequest } from './models/requests/GetMoviesRequest';

@injectable()
export class MovieService extends BaseService implements IMovieService {

  public constructor(

    @inject(Constants.DI.MOVIE_REPOSITORY_V1)
    private readonly _movieRepository: IRepository<MovieEntity>) {

    super();
  }

  public async getMovies(getMoviesRequest: GetMoviesRequest): Promise<PaginatedResponse<Movie>> {
    return await this._executeWithValidation(
      getMoviesRequest,
      async () => {

        const { pageIndex, pageSize, orderBy, orderByDir, locale } = getMoviesRequest;

        // Make query with sorting and pagination
        const query = this._movieRepository
          .find()
          .sort(MovieEntity.toDatabaseMovieOrderBy(orderBy, orderByDir, locale))
          .skip((pageIndex - 1) * pageSize)
          .limit(pageSize);
        const movieEntities: Array<IDocument<MovieEntity>> = await query.exec();
        const movies: Movie[] = movieEntities.map((movieEntity: MovieEntity) => movieEntity.toMovie(locale));

        let totalMovies: number | undefined;
        // Avoid making count query if we can infer the count from the previous query
        if (movieEntities.length < pageSize && (pageIndex === 1 || movieEntities.length > 0)) {
          totalMovies = (pageIndex - 1) * pageSize + movieEntities.length;
        }
        if (isNullOrUndefined(totalMovies)) {
          totalMovies = await this._movieRepository.countDocuments().exec();
        }

        return new PaginatedResponse<Movie>(pageIndex, pageSize, totalMovies, movies);
      }
    );
  }

  public async getMovieDetailByCode(getMovieDetailByCodeRequest: GetMovieDetailByCodeRequest): Promise<MovieDetail> {
    return await this._executeWithValidation(
      getMovieDetailByCodeRequest,
      async () => {

        const { code, locale } = getMovieDetailByCodeRequest;

        // Make query
        const movieEntity: IDocument<MovieEntity> | null = await this._movieRepository.findOne({ code }).exec();
        if (!movieEntity) {
          throw new ExternalError(StatusCodes.NOT_FOUND, 'movieDetailByCodeNotFound', { code });
        }

        return movieEntity.toMovieDetail(locale);
      }
    );
  }
}
