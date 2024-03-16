import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { responseBody } from '.';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request: Request = ctx.getRequest();
    const errorCode = exception?.['code'] || undefined;

    const response: Response = ctx.getResponse();

    const errorMessage = exception.message;

    this.logger.error(
      {
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
          url: request.url,
        },
        message: errorMessage,
        errors: exception?.['message'],
        cause: exception.cause,
      },
      exception.stack,
      'BaseExceptionFilter',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
      responseBody({
        code: errorCode,
        message: errorMessage,
        url: request.url,
        method: request.method,
      }),
    );
  }
}
