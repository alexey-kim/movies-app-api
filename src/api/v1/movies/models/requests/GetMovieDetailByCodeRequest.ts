import { Expose } from 'class-transformer';
import { IsIn, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { Locale, Locales } from '../../../../../localisation/types/Locale';
import { BaseValidatable } from '../../../../../validation/BaseValidatable';

export class GetMovieDetailByCodeRequest extends BaseValidatable {

  public constructor(
    code: string,
    locale: Locale) {

    super();
    this.code = code?.trim().toLowerCase();
    this.locale = locale;
  }

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  public readonly code: string;

  @Expose()
  @IsIn([...Locales])
  public readonly locale: Locale;
}
