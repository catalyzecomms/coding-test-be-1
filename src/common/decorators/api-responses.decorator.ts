import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ConflictErrorResponseDto,
} from '../dto/error-response.dto';

/**
 * Common API error responses that most endpoints can have
 */
export const ApiCommonResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad request - validation failed',
      type: ValidationErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponseDto,
    })
  );
};

/**
 * Not found response for endpoints that fetch by ID
 */
export const ApiNotFoundPostResponse = () => {
  return ApiNotFoundResponse({
    description: 'Post not found',
    type: ErrorResponseDto,
  });
};

/**
 * Conflict response for endpoints that can have slug conflicts
 */
export const ApiConflictPostResponse = () => {
  return ApiConflictResponse({
    description: 'Conflict - title creates duplicate slug',
    type: ConflictErrorResponseDto,
  });
};
