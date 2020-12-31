import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { Constants } from '../../constants';
import { ClassType } from '../../types/ClassType';
import { nonExhaustiveSwitchCase } from '../../utils/checkUtils';
import { getLocalisedProperties } from '../decorators/Localised';
import { IDatabaseOrdering } from '../interfaces/IDatabaseOrdering';

export async function setupDatabase(): Promise<void> {

  mongoose.connection.once('open', () => {
    console.log('Successfully connected to database'); // tslint:disable-line: ban no-console
  });

  mongoose.connection.on('error', (error: Error) => {
    console.error(error); // tslint:disable-line: ban no-console
    process.exit(1);
  });

  // TODO: In real-life applications use a proper instance of MongoDB
  const mongoMemoryServer: MongoMemoryServer = new MongoMemoryServer();
  const mongoUri: string = await mongoMemoryServer.getUri();
  console.log(`Connecting to database at [${mongoUri}]...`); // tslint:disable-line: ban no-console
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

export function flattenDatabaseOrderings<TClass>(classType: ClassType<TClass>, databaseOrderings: Array<IDatabaseOrdering<TClass>>): string {
  const localisedProperties: Array<keyof TClass> = getLocalisedProperties(classType);
  const databaseOrderingStrs: string[] = databaseOrderings.map(({ orderBy, orderByDir, locale }: IDatabaseOrdering<TClass>) => {
    let value: string = localisedProperties.includes(orderBy) ? `${orderBy}.${locale}` : orderBy as string;
    switch (orderByDir) {
      case Constants.ORDER_BY_DIR.ASC: break;
      case Constants.ORDER_BY_DIR.DESC: { value = `-${value}`; break; } // Prefix with '-' to order in descending order
      default: nonExhaustiveSwitchCase(orderByDir);
    }
    return value;
  });
  return databaseOrderingStrs.join(' ');
}
