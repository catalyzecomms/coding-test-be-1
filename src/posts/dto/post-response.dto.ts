import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ description: 'Unique identifier for the post', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Title of the post',
    example: 'My First Blog Post',
  })
  title: string;

  @ApiProperty({
    description: 'URL-friendly slug generated from title',
    example: 'my-first-blog-post',
  })
  slug: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'This is the content of my blog post...',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'When the post was published (Jakarta time)',
    example: '2025-09-02T17:30:00.000Z',
    required: false,
  })
  publishedAt?: Date;

  @ApiProperty({
    description: 'When the post was created',
    example: '2025-09-02T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the post was last updated',
    example: '2025-09-02T10:30:00.000Z',
  })
  updatedAt: Date;
}
