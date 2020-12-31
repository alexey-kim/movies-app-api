import { StatusCodes } from 'http-status-codes';
import { ISerialisable } from '../serialisation/interfaces/ISerialisable';
import { ExternalError } from './ExternalError';
import { IExternalErrorCodes } from './interfaces/IExternalErrorCodes';

export class InternalError extends Error implements ISerialisable {

  public constructor(
    public readonly errorMessage: string,
    public readonly errorDetails?: string[],
    public readonly statusCode?: number) {

    super(errorMessage);
    this.name = InternalError.name;
  }

  public toExternalError(): ExternalError<keyof IExternalErrorCodes> {
    const statusCode: number = this.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    switch (statusCode) {
      case StatusCodes.UNAUTHORIZED: return new ExternalError(statusCode, 'unauthorized', undefined);
      case StatusCodes.FORBIDDEN: return new ExternalError(statusCode, 'forbidden', undefined);
      default: return new ExternalError(statusCode, 'internalServerError', undefined);
    }
  }

  public toJSON(): object {
    const { name, errorMessage, errorDetails, statusCode, stack } = this;
    return { name, errorMessage, errorDetails, statusCode, stack };
  }

  public toLoggingJSON(): object {
    return this.toJSON();
  }
}
