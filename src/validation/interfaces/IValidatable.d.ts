import { ISerialisable } from '../../serialisation/interfaces/ISerialisable';

export interface IValidatable extends ISerialisable {
  readonly isValid: boolean;
  readonly errorMessages: string[];
  validate(): Promise<boolean>;
}
