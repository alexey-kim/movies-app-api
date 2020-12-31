import { classToPlain } from 'class-transformer';
import { ISerialisable } from './interfaces/ISerialisable';

export abstract class BaseSerialisable implements ISerialisable {

  public toJSON(): object {
    return classToPlain(this, {
      strategy: 'excludeAll',
      enableCircularCheck: true
    });
  }

  public toLoggingJSON(): object {
    return classToPlain(this, {
      strategy: 'exposeAll',
      excludePrefixes: ['_', '__'],
      enableCircularCheck: true
    });
  }
}
