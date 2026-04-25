import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithUser & Request>();
    const response = http.getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log('Request completed', 'RequestLoggingInterceptor', {
            method: request.method,
            path: request.originalUrl || request.url,
            statusCode: response.statusCode,
            durationMs: Date.now() - startedAt,
            userId: request.user?.id,
          });
        },
      }),
    );
  }
}
