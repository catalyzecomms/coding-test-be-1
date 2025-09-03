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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { Post as PostEntity } from './entities/post.entity';
import {
  ApiCommonResponses,
  ApiNotFoundPostResponse,
  ApiConflictPostResponse,
} from '../common/decorators/api-responses.decorator';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ConflictErrorResponseDto,
} from '../common/dto/error-response.dto';

@ApiTags('posts')
@ApiExtraModels(
  PostResponseDto,
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ConflictErrorResponseDto
)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Creates a new post with auto-generated slug. User must provide publishedAt date.',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiCommonResponses()
  @ApiConflictPostResponse()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return await this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active posts',
    description:
      'Retrieves all active posts ordered by creation date (newest first)',
  })
  @ApiOkResponse({
    description: 'List of all active posts',
    type: [PostResponseDto],
  })
  @ApiCommonResponses()
  async findAll(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Retrieves a specific post by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Post ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Post found',
    type: PostResponseDto,
  })
  @ApiCommonResponses()
  @ApiNotFoundPostResponse()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post by ID',
    description:
      'Updates a post. If title is changed, slug will be automatically regenerated.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Post ID',
    example: 1,
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiCommonResponses()
  @ApiNotFoundPostResponse()
  @ApiConflictPostResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete a post by ID',
    description:
      'Soft deletes a post by setting isActive to false. The post data is preserved.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Post ID',
    example: 1,
  })
  @ApiNoContentResponse({
    description: 'Post deleted successfully (soft delete)',
  })
  @ApiCommonResponses()
  @ApiNotFoundPostResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postsService.remove(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get a post by slug',
    description: 'Retrieves a post using its URL-friendly slug identifier',
  })
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Post slug (URL-friendly identifier)',
    example: 'my-first-blog-post',
  })
  @ApiOkResponse({
    description: 'Post found',
    type: PostResponseDto,
  })
  @ApiCommonResponses()
  @ApiNotFoundPostResponse()
  async findBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return await this.postsService.findBySlug(slug);
  }
}
