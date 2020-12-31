import { Document } from 'mongoose';

export type IDocument<T> = Document & T;
