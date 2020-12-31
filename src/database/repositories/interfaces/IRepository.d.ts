import { Model } from 'mongoose';
import { IDocument } from './IDocument';

export interface IRepository<T> extends Model<IDocument<T>> { }
