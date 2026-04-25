import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const normalizedError =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'error' in exceptionResponse
        ? String(exceptionResponse.error)
        : status >= 500
          ? 'Internal Server Error'
          : 'Request Error';

    const normalizedMessage = this.extractMessage(exception, exceptionResponse);

    this.logger.error(
      normalizedMessage,
      exception instanceof Error ? exception.stack : undefined,
      'GlobalExceptionFilter',
      {
        method: request.method,
        path: request.originalUrl || request.url,
        statusCode: status,
        userAgent: request.headers['user-agent'],
      },
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url,
      method: request.method,
      message: normalizedMessage,
      error: normalizedError,
    });
  }

  private extractMessage(exception: unknown, exceptionResponse: unknown) {
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const message = exceptionResponse.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Ocorreu um erro inesperado.';
  }
}
