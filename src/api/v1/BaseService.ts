import { injectable } from 'inversify';
import { isNullOrUndefined } from '../../utils/checkUtils';
import { IValidatable } from '../../validation/interfaces/IValidatable';
import { withValidation } from '../../validation/utils/validationUtils';

@injectable()
export abstract class BaseService {

  protected async _executeWithValidation<
    TRequest extends IValidatable | undefined,
    TResponse extends IValidatable>(
      request: TRequest,
      func: () => Promise<TResponse>
    ): Promise<TResponse> {

    if (!isNullOrUndefined(request)) {
      await withValidation(request!, true);
    }
    const response: TResponse = await func();
    return await withValidation(response, false);
  }
}
