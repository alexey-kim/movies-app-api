import { InternalError } from '../errors/InternalError';

/**
 * Function to be used in 'default' case of switch statements to ensure all possible cases are defined.
 * This function accepts a parameter of type 'never' which is possible only if ALL cases are previously defined.
 * This function is just a safety check to notify of missing switch cases at build time.
 */
export function nonExhaustiveSwitchCase(value: never): never {
  throw new InternalError(`Switch statement hasn't defined all possible cases. [${value}] must be explicitly defined in switch statement.`);
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function equalsAnyCase(text1: string | null | undefined, text2: string | null | undefined): boolean {
  return (text1 === null && text2 === null)
    || (text1 === undefined && text2 === undefined)
    || (typeof text1 === 'string' && typeof text2 === 'string' && text1.toLowerCase() === text2.toLowerCase());
}
