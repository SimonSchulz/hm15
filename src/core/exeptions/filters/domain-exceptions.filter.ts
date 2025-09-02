import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

export interface ErrorMessage {
  message: string;
  field: string;
}

@Catch()
export class UniversalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Если не валидация (не 400) — обычный формат
    if (status !== HttpStatus.BAD_REQUEST) {
      const message =
        exception instanceof HttpException
          ? (exception.getResponse() as any)?.message || exception.message
          : exception instanceof Error
            ? exception.message
            : 'Internal server error';

      res.status(status).json({ statusCode: status, message });
      return;
    }

    // Валидационные ошибки (400)
    const errorsMessages: ErrorMessage[] = [];

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (Array.isArray(response)) {
        (response as ValidationError[]).forEach((err) => {
          if (err.constraints) {
            Object.values(err.constraints).forEach((msg) => {
              // если property есть — используем, иначе вытаскиваем первое слово из сообщения
              const field = err.property || msg.split(' ')[0] || 'unknown';
              errorsMessages.push({ message: msg, field });
            });
          } else {
            const field = err.property || 'unknown';
            errorsMessages.push({
              message: 'Validation error',
              field,
            });
          }
        });
      } else if (typeof response === 'object' && response !== null) {
        const messages = (response as any).message;
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            const field =
              typeof msg === 'string' ? msg.split(' ')[0] : 'unknown';
            errorsMessages.push({ message: String(msg), field });
          });
        } else if (typeof messages === 'string') {
          const field = messages.split(' ')[0];
          errorsMessages.push({ message: messages, field });
        }
      } else if (typeof response === 'string') {
        const field = response.split(' ')[0];
        errorsMessages.push({ message: response, field });
      }
    }

    res.status(status).json({ errorsMessages });
  }
}
