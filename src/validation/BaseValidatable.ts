import { ExposeMetadata } from 'class-transformer/metadata/ExposeMetadata';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { validate, ValidationError } from 'class-validator';
import { BaseSerialisable } from '../serialisation/BaseSerialisable';
import { joinNotEmptyNorWhitespace } from '../utils/arrayUtils';
import { isNullOrUndefined } from '../utils/checkUtils';
import { toInt } from '../utils/stringUtils';
import { IValidatable } from './interfaces/IValidatable';

export abstract class BaseValidatable extends BaseSerialisable implements IValidatable {

  public get isValid(): boolean {
    return this._errorMessages.length === 0;
  }

  private _errorMessages: string[] = [];
  public get errorMessages(): string[] {
    return this._errorMessages;
  }

  public async validate(): Promise<boolean> {
    const validationErrors: ValidationError[] = await validate(this, { forbidUnknownValues: true });
    this._errorMessages = validationErrors.length ? BaseValidatable._flattenValidationErrors(validationErrors) : [];
    return this.isValid;
  }

  private static _flattenValidationErrors(validationErrors: ValidationError[], fullParentProperty: string = '', parentTarget?: object, parentProperty: string = ''): string[] {

    const flatValidationErrors: string[] = [];

    if (Array.isArray(validationErrors)) {
      for (const validationError of validationErrors) {

        const { target: currentTarget, property: initialCurrentProperty } = validationError;
        let currentProperty: string = initialCurrentProperty;

        if (currentTarget) {
          // Check if property name should be exposed as a different property name
          const exposeMetadata: ExposeMetadata | undefined = defaultMetadataStorage.findExposeMetadata(currentTarget.constructor, currentProperty);
          currentProperty = exposeMetadata?.options.name ?? initialCurrentProperty;
        }

        // For array validations property name can be an index so format it as 'parent[index]'
        const fullProperty: string = !isNullOrUndefined(toInt(currentProperty))
          ? `${fullParentProperty}[${currentProperty}]`
          // Special case for array validations to avoid duplication of property name in the message
          : (parentTarget !== currentTarget && parentProperty !== currentProperty
            ? joinNotEmptyNorWhitespace([fullParentProperty, currentProperty], '.')
            : fullParentProperty);

        if (typeof validationError.constraints === 'object') {
          for (const constraintKey of Object.keys(validationError.constraints)) {
            flatValidationErrors.push(`${fullProperty}: ${validationError.constraints[constraintKey].replace(initialCurrentProperty, currentProperty)}`);
          }
        }

        flatValidationErrors.push(...this._flattenValidationErrors(validationError.children, fullProperty, currentTarget, currentProperty));
      }
    }

    return flatValidationErrors;
  }
}
