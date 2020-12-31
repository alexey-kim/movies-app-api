import { Constants } from '../../../../constants';
import { Locale } from '../../../../localisation/types/Locale';
import { MovieEntity } from '../entities/MovieEntity';
import { MovieRepository } from '../repositories/MovieRepository';
import { movies } from './movies.json';

export async function seedInitialMovies(): Promise<void> {
  console.log(`Creating movies in database...`); // tslint:disable-line: ban no-console
  const description: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  const movieEntities: MovieEntity[] = movies.map(({ title, pictureUrls, rating, releaseDate }) => {
    return new MovieEntity({
      code: `${new Date(releaseDate).getUTCFullYear()}-${title}`.toLowerCase().replace(/[^a-z0-9']+/g, '-').replace(/(^-+)|(-+$)|('+)/g, ''),
      titles: new Map<Locale, string>([
        [Constants.DEFAULTS.LOCALE, title],
        ['en-CA', `${title} (CA)`],
        ['en-GB', `${title} (GB)`]
      ]),
      descriptions: new Map<Locale, string>([
        [Constants.DEFAULTS.LOCALE, `${title} - ${description}`],
        ['en-CA', `${title} (CA) - ${description}`],
        ['en-GB', `${title} (GB) - ${description}`]
      ]),
      pictureUrlCsvs: new Map<Locale, string>([
        [Constants.DEFAULTS.LOCALE, pictureUrls.join(',')],
        ['en-CA', pictureUrls.join(',')],
        ['en-GB', pictureUrls.join(',')]
      ]),
      rating,
      releaseDate: new Date(releaseDate),
      lengthInMins: Math.floor(Math.random() * (150 - 90 + 1)) + 90 // Get a random number between 1.5h and 2.5h
    });
  });
  await MovieRepository.create(movieEntities);
  console.log(`Successfully created ${movieEntities.length} movies in database`); // tslint:disable-line: ban no-console
}
