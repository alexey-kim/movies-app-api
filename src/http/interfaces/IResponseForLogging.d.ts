import { Response } from 'express';

export interface IResponseForLogging extends Pick<Response, 'on' | 'statusCode' | 'statusMessage' | 'getHeaders'> { }
