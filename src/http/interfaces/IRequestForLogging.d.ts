import { Request } from 'express';

export interface IRequestForLogging extends Pick<Request, 'protocol' | 'url' | 'method' | 'headers' | 'body' | 'httpVersion'> { }
