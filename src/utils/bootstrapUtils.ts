import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import { Container } from 'inversify';
import { getRouteInfo, InversifyExpressServer } from 'inversify-express-utils';
import { MovieEntity as MovieEntityV1 } from '../api/v1/movies/entities/MovieEntity';
import { IMovieService as IMovieServiceV1 } from '../api/v1/movies/interfaces/IMovieService';
import { MovieController as MovieControllerV1 } from '../api/v1/movies/MovieController';
import { MovieService as MovieServiceV1 } from '../api/v1/movies/MovieService';
import { MovieRepository as MovieRepositoryV1 } from '../api/v1/movies/repositories/MovieRepository';
import { seedInitialMovies as seedInitialMoviesV1 } from '../api/v1/movies/seeders/seedInitialMovies';
import { DotEnvConfig } from '../config/DotEnvConfig';
import { IConfig } from '../config/interfaces/IConfig';
import { Constants } from '../constants';
import { IRepository } from '../database/repositories/interfaces/IRepository';
import { setupDatabase } from '../database/utils/databaseUtils';
import { globalErrorHandler, http404NotFoundErrorHandler } from '../errors/handlers';
import { requestResponseLogging } from '../http/middlewares/requestResponseLogging';
import { errorToLoggingJSON } from '../serialisation/utils/serialisationUtils';

export async function bootstrap(): Promise<void> {
  try {

    const config: IConfig = await DotEnvConfig.init(Constants.PATHS.DOT_ENV);

    const container: Container = new Container();
    container.bind<IConfig>(Constants.DI.CONFIG).toConstantValue(config);
    container.bind<MovieControllerV1>(Constants.DI.MOVIE_CONTROLLER_V1).to(MovieControllerV1).inSingletonScope();
    container.bind<IMovieServiceV1>(Constants.DI.MOVIE_SERVICE_V1).to(MovieServiceV1).inSingletonScope();
    container.bind<IRepository<MovieEntityV1>>(Constants.DI.MOVIE_REPOSITORY_V1).toConstantValue(MovieRepositoryV1);

    await setupDatabase();
    await seedInitialMoviesV1();

    const server: InversifyExpressServer = new InversifyExpressServer(container)
      .setConfig((app: Application) => {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(requestResponseLogging());
        app.use(compression());
        app.use(helmet());
      })
      .setErrorConfig((app: Application) => {
        app.use(http404NotFoundErrorHandler());
        app.use(globalErrorHandler());
      });

    const application: Application = server.build();

    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo, undefined, 2)); // tslint:disable-line: ban no-console

    const applicationPort: number = config.APP_PORT;
    application.listen(applicationPort, () => console.log(`Listening on http://localhost:${applicationPort}`)); // tslint:disable-line: ban no-console
  } catch (error) {
    console.error(JSON.stringify(errorToLoggingJSON(error), undefined, 2)); // tslint:disable-line: ban no-console
  }
}
