import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description:
      'Post created successfully (publishedAt defaults to Jakarta time)',
    type: PostEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - title creates duplicate slug',
  })
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return await this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active posts' })
  @ApiResponse({
    status: 200,
    description: 'List of all active posts',
    type: [PostEntity],
  })
  async findAll(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Post ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Post ID',
    example: 1,
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - title creates duplicate slug',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a post by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Post ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Post deleted successfully (soft delete)',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postsService.remove(id);
  }

  // Additional endpoint to get post by slug
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a post by slug' })
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Post slug',
    example: 'my-first-blog-post',
  })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async findBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return await this.postsService.findBySlug(slug);
  }
}
