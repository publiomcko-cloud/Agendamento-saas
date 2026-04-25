import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

type LogPayload = {
  timestamp: string;
  level: LogLevel | 'fatal';
  context?: string;
  message: string;
  meta?: Record<string, unknown>;
  trace?: string;
};

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  log(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.printStructured('log', message, context, meta);
  }

  error(
    message: unknown,
    trace?: string,
    context?: string,
    meta?: Record<string, unknown>,
  ) {
    this.printStructured('error', message, context, meta, trace);
  }

  warn(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.printStructured('warn', message, context, meta);
  }

  debug(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.printStructured('debug', message, context, meta);
  }

  verbose(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.printStructured('verbose', message, context, meta);
  }

  private printStructured(
    level: LogLevel,
    message: unknown,
    context?: string,
    meta?: Record<string, unknown>,
    trace?: string,
  ) {
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: this.normalizeMessage(message),
      meta,
      trace,
    };

    const serializedPayload = JSON.stringify(payload);

    switch (level) {
      case 'error':
        process.stderr.write(`${serializedPayload}\n`);
        break;
      default:
        process.stdout.write(`${serializedPayload}\n`);
        break;
    }
  }

  private normalizeMessage(message: unknown) {
    if (typeof message === 'string') {
      return message;
    }

    if (message instanceof Error) {
      return message.message;
    }

    return JSON.stringify(message);
  }
}
