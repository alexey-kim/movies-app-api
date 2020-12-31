import { Request } from 'express';

export interface IRequestWithMethodAndUrl extends Pick<Request, 'method' | 'url'> { }
