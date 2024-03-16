import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { VALIDATION_CODE } from '@utils/pipes';

import { Request, Response } from 'express';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request: Request = ctx.getRequest();
    const errorCode = exception?.['code'] || undefined;

    const meta = {
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    const response: Response = ctx.getResponse();

    const errorMessage = exception.message;

    this.logger.error(
      {
        request: {
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
        },
        message: errorMessage,
        errors: exception?.['message'],
        cause: exception.cause,
      },
      exception.stack,
      'BaseExceptionFilter',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      meta,
      code: errorCode,
      detail: errorMessage,
    });
  }
}
