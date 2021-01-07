import { StatusCodes } from 'http-status-codes';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { DocumentQuery } from 'mongoose';
import { assertExternalError } from '../../../../../tests/testUtils';
import { Constants } from '../../../../constants';
import { IDocument } from '../../../../database/repositories/interfaces/IDocument';
import { IRepository } from '../../../../database/repositories/interfaces/IRepository';
import { BaseService } from '../../BaseService';
import { MovieEntity } from '../entities/MovieEntity';
import { GetMovieDetailByCodeRequest } from '../models/requests/GetMovieDetailByCodeRequest';
import { MovieService } from '../MovieService';

type MovieDocumentQuery = DocumentQuery<IDocument<MovieEntity> | null, IDocument<MovieEntity>, {}>;

describe('MovieService', () => {

  const movieDocumentQueryMock: MockProxy<MovieDocumentQuery> & MovieDocumentQuery = mock<MovieDocumentQuery>();
  const movieRepositoryMock: MockProxy<IRepository<MovieEntity>> & IRepository<MovieEntity> = mock<IRepository<MovieEntity>>();
  let movieService: MovieService;

  beforeEach(() => {
    mockReset(movieDocumentQueryMock);
    mockReset(movieRepositoryMock);
    movieService = new MovieService(movieRepositoryMock);
  });

  describe('constructor', () => {

    it('Should inherit from BaseService', () => {
      expect(movieService).toBeInstanceOf(BaseService);
      expect(movieService).toBeInstanceOf(MovieService);
      expect((movieService as any)._movieRepository).toBe(movieRepositoryMock);
    });
  });

  describe('getMovieDetailByCode', () => {

    const CODE = 'code';

    it(`Should throw 'movieDetailByCodeNotFound' external error if movie detail by code is not found`, async () => {

      movieDocumentQueryMock.exec.mockResolvedValue(null);
      movieRepositoryMock.findOne.mockReturnValue(movieDocumentQueryMock);

      await assertExternalError(
        async () => await movieService.getMovieDetailByCode(new GetMovieDetailByCodeRequest(CODE, Constants.DEFAULTS.LOCALE)),
        StatusCodes.NOT_FOUND,
        'movieDetailByCodeNotFound',
        { code: CODE }
      );

      expect(movieRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(movieRepositoryMock.findOne).toHaveBeenNthCalledWith(1, { code: CODE });

      expect(movieDocumentQueryMock.exec).toHaveBeenCalledTimes(1);
      expect(movieDocumentQueryMock.exec).toHaveBeenNthCalledWith(1);
    });
  });
});
