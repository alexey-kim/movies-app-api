import { ExternalError } from '../../errors/ExternalError';
import { InternalError } from '../../errors/InternalError';

export function errorToLoggingJSON(error: Error): object {
  return (error instanceof ExternalError || error instanceof InternalError)
    ? error.toLoggingJSON()
    : {
      ...error,
      name: error.name,
      message: error.message,
      stack: error.stack
    };
}
