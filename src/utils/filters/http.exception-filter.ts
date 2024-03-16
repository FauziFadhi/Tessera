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
import { responseBody } from '.';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request: Request = ctx.getRequest();

    const errorResponse = exception.getResponse();

    const errorCode =
      errorResponse?.['code'] || errorResponse?.['error'] || undefined;

    const status = exception.getStatus();

    const response: Response = ctx.getResponse();

    let errorMessage = exception.message;

    const isValidationException =
      errorCode == VALIDATION_CODE &&
      status === HttpStatus.UNPROCESSABLE_ENTITY;

    if (isValidationException) {
      errorMessage = errorResponse?.['message'].map((error) => {
        return {
          source: error.field
            ? {
                pointer: error.field,
              }
            : undefined,
          detail: error.message,
        };
      });
    }

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
        errors: errorResponse?.['message'],
        cause: exception.cause,
        code: errorCode,
      },
      exception.stack,
      'HttpException',
    );

    return response.status(exception.getStatus()).send(
      responseBody({
        code: errorCode,
        message: errorMessage,
        method: request.method,
        url: request.url,
      }),
    );
  }
}
