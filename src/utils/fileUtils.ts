import { join } from 'path';

export function getAbsolutePath(...paths: string[]): string {
  // Trim all trailing forward slashes
  return join(process.cwd(), ...paths).replace(/\/+$/, '');
}
