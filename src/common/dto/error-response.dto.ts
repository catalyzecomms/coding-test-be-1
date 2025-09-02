import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Detailed validation errors',
    example: ['title should not be empty', 'content must be a string'],
    type: [String],
  })
  message: string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}

export class ConflictErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Conflict error message',
    example:
      'A post with the title "My Post" already exists or creates a conflicting slug. Please try a different title.',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Conflict',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 409,
  })
  statusCode: number;
}
