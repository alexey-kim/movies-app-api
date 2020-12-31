import { PaginatedResponse } from '../../models/PaginatedResponse';
import { Movie } from '../models/Movie';
import { MovieDetail } from '../models/MovieDetail';
import { GetMovieDetailByCodeRequest } from '../models/requests/GetMovieDetailByCodeRequest';
import { GetMoviesRequest } from '../models/requests/GetMoviesRequest';

export interface IMovieService {
  getMovies(getMoviesRequest: GetMoviesRequest): Promise<PaginatedResponse<Movie>>;
  getMovieDetailByCode(getMovieDetailByCodeRequest: GetMovieDetailByCodeRequest): Promise<MovieDetail>;
}
