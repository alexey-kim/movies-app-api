import { ExternalError } from '../src/errors/ExternalError';
import { IExternalErrorCodes } from '../src/errors/interfaces/IExternalErrorCodes';
import { InternalError } from '../src/errors/InternalError';

export function assertError(error: Error, errorName: string, errorMessage: string): void {
  expect(error).toBeInstanceOf(Error);
  expect(error.name).toBe(errorName);
  expect(error.message).toBe(errorMessage);
  expect(error.stack).not.toBe('');
}

export async function assertInternalError(
  func: () => Promise<unknown>,
  errorMessage: string,
  errorDetails?: string[],
  statusCode?: number): Promise<void> {

  let internalError: InternalError | undefined;

  try {
    await func();
  } catch (error) {
    internalError = error;
  }

  if (internalError) {
    assertError(internalError, InternalError.name, errorMessage);
    expect(internalError).toBeInstanceOf(InternalError);
    expect(internalError.errorMessage).toBe(errorMessage);
    expect(internalError.errorDetails).toStrictEqual(errorDetails);
    expect(internalError.statusCode).toBe(statusCode);
  } else {
    throw new Error(`Internal error [${errorMessage}] hasn't been thrown`);
  }
}

export async function assertExternalError<TExternalErrorCode extends keyof IExternalErrorCodes>(
  func: () => Promise<unknown>,
  statusCode: number,
  errorCode: TExternalErrorCode,
  errorDetails: IExternalErrorCodes[TExternalErrorCode]): Promise<void> {

  let externalError: ExternalError<TExternalErrorCode> | undefined;

  try {
    await func();
  } catch (error) {
    externalError = error;
  }

  if (externalError) {
    assertError(externalError, ExternalError.name, errorCode);
    expect(externalError).toBeInstanceOf(ExternalError);
    expect(externalError.statusCode).toBe(statusCode);
    expect(externalError.errorCode).toBe(errorCode);
    expect(externalError.errorDetails).toStrictEqual(errorDetails);
  } else {
    throw new Error(`External error [${errorCode}] hasn't been thrown`);
  }
}
