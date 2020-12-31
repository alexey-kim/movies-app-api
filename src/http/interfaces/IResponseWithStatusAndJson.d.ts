import { Response } from 'express';

export interface IResponseWithStatusAndJson extends Pick<Response, 'status' | 'json'> { }
