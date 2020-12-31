import { RequestHandler } from 'express';
import { OutgoingHttpHeaders } from 'http';
import { IRequestForLogging } from '../interfaces/IRequestForLogging';
import { IResponseForLogging } from '../interfaces/IResponseForLogging';

export function requestResponseLogging(): RequestHandler {
  return (request: IRequestForLogging, response: IResponseForLogging, next: Function) => {

    const requestStartDate: Date = new Date();
    const { protocol, url, method, headers, body, httpVersion } = request;
    console.log(JSON.stringify({ protocol, url, method, headers, body, httpVersion }, undefined, 2)); // tslint:disable-line: ban no-console

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const responseHeaders: OutgoingHttpHeaders = response.getHeaders();
      const requestDurationInMs: number = new Date().getTime() - requestStartDate.getTime();
      console.log(JSON.stringify({ statusCode, statusMessage, responseHeaders, requestDurationInMs }, undefined, 2)); // tslint:disable-line: ban no-console
    });

    next();
  };
}
