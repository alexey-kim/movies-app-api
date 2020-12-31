import { StatusCodes } from 'http-status-codes';
import { ExternalError } from '../../errors/ExternalError';
import { InternalError } from '../../errors/InternalError';
import { BaseValidatable } from '../BaseValidatable';
import { IValidatable } from '../interfaces/IValidatable';

export async function withValidation<TValidatable extends IValidatable>(obj: TValidatable, isExternalTarget: boolean): Promise<TValidatable> {

  if (!(obj instanceof BaseValidatable)) {
    throw new InternalError(`Object must be an instance of ${BaseValidatable.name} class`);
  }

  if (!(await obj.validate())) {
    const error: Error = isExternalTarget
      ? new ExternalError(StatusCodes.BAD_REQUEST, 'validationFailed', { errorMessages: obj.errorMessages })
      : new InternalError('Object failed validation', obj.errorMessages);
    throw error;
  }

  return obj;
}
