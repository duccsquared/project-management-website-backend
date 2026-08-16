import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

type PrismaClientError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientRustPanicError;

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

/**
 * Maps well-known Prisma error codes to HTTP status codes so the client
 * receives semantically correct responses instead of a generic 500.
 */
const PRISMA_STATUS_CODES: Record<string, HttpStatus> = {
  P2000: HttpStatus.BAD_REQUEST, // value out of range
  P2002: HttpStatus.CONFLICT, // unique constraint failed
  P2003: HttpStatus.CONFLICT, // foreign key constraint failed
  P2009: HttpStatus.BAD_REQUEST, // query validation error
  P2025: HttpStatus.NOT_FOUND, // record not found
};

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientError, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ErrorResponse>>();

    response.status(exception ? this.getStatus(exception) : HttpStatus.INTERNAL_SERVER_ERROR).json(this.buildResponse(exception));
  }

  private getStatus(exception: PrismaClientError): number {
    if (exception instanceof Prisma.PrismaClientValidationError) {
      // Malformed/misspelled fields in query params (e.g. ?include=aaa)
      return HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return PRISMA_STATUS_CODES[exception.code] ?? HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildResponse(exception: PrismaClientError): ErrorResponse {
    // Validation errors: the message contains the exact Prisma error, e.g.
    // The last non-empty line is the actual description.
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: this.extractValidationMessage(exception),
        error: 'Bad Request',
      };
    }

    // Known request errors carry a Prisma error code (e.g. P2025 not found).
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const message =
        typeof exception.message === 'string'
          ? exception.message.split('\n')[0]
          : 'Prisma request failed';
      return {
        statusCode: PRISMA_STATUS_CODES[exception.code] ?? HttpStatus.BAD_REQUEST,
        message,
        error: exception.code,
      };
    }

    // Connection/runtime failures are server-side issues.
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: exception.constructor.name,
    };
  }

  private extractValidationMessage(exception: Prisma.PrismaClientValidationError): string {
    const lines =
      typeof exception.message === 'string' ? exception.message.split('\n') : [];

    // The last non-empty line is the human-readable description.
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line) {
        return line;
      }
    }

    return exception.message.trim();
  }
}