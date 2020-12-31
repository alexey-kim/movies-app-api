import { getModelForClass } from '@typegoose/typegoose';
import { IRepository } from '../../../../database/repositories/interfaces/IRepository';
import { MovieEntity } from '../entities/MovieEntity';

export const MovieRepository: IRepository<MovieEntity> = getModelForClass(MovieEntity);
