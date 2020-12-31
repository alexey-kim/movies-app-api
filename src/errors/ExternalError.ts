import { ISerialisable } from '../serialisation/interfaces/ISerialisable';
import { IExternalErrorCodes } from './interfaces/IExternalErrorCodes';

export class ExternalError<TExternalErrorCode extends keyof IExternalErrorCodes> extends Error implements ISerialisable {

  public constructor(
    public readonly statusCode: number,
    public readonly errorCode: TExternalErrorCode,
    public readonly errorDetails: IExternalErrorCodes[TExternalErrorCode]) {

    super(errorCode);
    this.name = ExternalError.name;
  }

  public toJSON(): object {
    const { statusCode, errorCode, errorDetails } = this;
    // Do not include error stack since this object will be sent to the client
    return { statusCode, errorCode, errorDetails };
  }

  public toLoggingJSON(): object {
    return {
      name: this.name,
      ...this.toJSON(),
      stack: this.stack
    };
  }
}
