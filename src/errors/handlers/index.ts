import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IRequestWithMethodAndUrl } from '../../http/interfaces/IRequestWithMethodAndUrl';
import { IResponseWithStatusAndJson } from '../../http/interfaces/IResponseWithStatusAndJson';
import { errorToLoggingJSON } from '../../serialisation/utils/serialisationUtils';
import { ExternalError } from '../ExternalError';
import { IExternalErrorCodes } from '../interfaces/IExternalErrorCodes';
import { InternalError } from '../InternalError';

export function http404NotFoundErrorHandler(): RequestHandler {
  return (request: IRequestWithMethodAndUrl, _response: unknown, _next: unknown) => {
    const { method: httpMethod, url } = request;
    throw new ExternalError(StatusCodes.NOT_FOUND, 'endpointNotFound', { httpMethod, url });
  };
}

export function globalErrorHandler(): ErrorRequestHandler {
  return (error: Error, _request: unknown, response: IResponseWithStatusAndJson, _next: unknown) => {
    console.error(JSON.stringify(errorToLoggingJSON(error), undefined, 2)); // tslint:disable-line: ban no-console
    const externalError: ExternalError<keyof IExternalErrorCodes> = error instanceof ExternalError
      ? error
      : error instanceof InternalError
        ? error.toExternalError()
        : new ExternalError(StatusCodes.INTERNAL_SERVER_ERROR, 'internalServerError', undefined);
    if (error !== externalError) {
      // Do not use 'errorToLoggingJSON' function here so that unnecessary error stack is not logged
      console.error(JSON.stringify(externalError, undefined, 2)); // tslint:disable-line: ban no-console
    }
    response.status(externalError.statusCode).json(externalError);
  };
}
