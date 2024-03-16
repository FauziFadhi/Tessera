import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { meta, responseBody } from '.';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request: Request = ctx.getRequest();
    const errorCode = exception?.['code'] || undefined;

    const response: Response = ctx.getResponse();

    const errorMessage = exception.message;
    const metaData = meta({ url: request.url, method: request.method });

    this.logger.error(
      {
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
          url: request.url,
        },
        meta: metaData,
        message: errorMessage,
        errors: exception?.['message'],
        cause: exception.cause,
        code: errorCode,
      },
      exception.stack,
      'TypeormExceptionFilter',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
      responseBody({
        code: errorCode,
        message: 'internal server error',
        meta: metaData,
      }),
    );
  }
}
