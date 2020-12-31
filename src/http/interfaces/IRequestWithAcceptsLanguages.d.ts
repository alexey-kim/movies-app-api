import { Request } from 'express';

export interface IRequestWithAcceptsLanguages extends Pick<Request, 'acceptsLanguages'> { }
