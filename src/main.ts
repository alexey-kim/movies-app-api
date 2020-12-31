import 'reflect-metadata';
import { bootstrap } from './utils/bootstrapUtils';

process.on('uncaughtException', (error: Error) => {
  console.error(error); // tslint:disable-line: ban no-console
  process.exit(1);
});

process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<unknown>) => {
  console.error(reason, promise); // tslint:disable-line: ban no-console
  process.exit(1);
});

void bootstrap();
