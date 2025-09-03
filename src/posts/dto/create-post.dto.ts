import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'My First Blog Post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'This is the content of my first blog post...',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'When the post should be published (user must select date)',
    example: '2024-01-15T10:00:00Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  publishedAt: Date;
}
