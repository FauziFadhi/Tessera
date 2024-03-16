import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';
import { responseBody } from '.';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request: Request = ctx.getRequest();
    const errorCode = exception?.['code'] || undefined;

    const response: Response = ctx.getResponse();

    this.logger.error(
      {
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
          url: request.url,
        },
        message: exception.message,
        errors: exception?.['message'],
        cause: exception.cause,
      },
      exception.stack,
      'TypeormExceptionFilter',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
      responseBody({
        method: request.method,
        url: request.url,
        code: errorCode,
        message: 'internal server error',
      }),
    );
  }
}
