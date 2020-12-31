import { Locale } from '../../localisation/types/Locale';
import { OrderByDir } from '../../types/OrderByDir';

export interface IDatabaseOrdering<TClass> {
  readonly orderBy: keyof TClass;
  readonly orderByDir: OrderByDir;
  readonly locale: Locale;
}
