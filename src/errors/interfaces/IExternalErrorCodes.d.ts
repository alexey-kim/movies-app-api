export interface IExternalErrorCodes {
  readonly endpointNotFound: {
    readonly httpMethod: string;
    readonly url: string;
  };
  readonly forbidden: undefined;
  readonly internalServerError: undefined;
  readonly movieDetailByCodeNotFound: {
    readonly code: string;
  }
  readonly unauthorized: undefined;
  readonly validationFailed: {
    readonly errorMessages: string[];
  };
}
