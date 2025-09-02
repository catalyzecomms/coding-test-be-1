import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Create a new post instance to trigger slug generation
    const post = this.postRepository.create(createPostDto);

    // Check if slug already exists
    const existingPost = await this.postRepository.findOne({
      where: { slug: post.slug },
    });

    if (existingPost) {
      // Add timestamp to make slug unique
      const timestamp = Date.now();
      post.slug = `${post.slug}-${timestamp}`;
    }

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('A post with this slug already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id, isActive: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    // If title is being updated, regenerate slug
    if (updatePostDto.title && updatePostDto.title !== post.title) {
      const tempPost = this.postRepository.create({
        ...post,
        ...updatePostDto,
      });

      // Check if new slug already exists
      const existingPost = await this.postRepository.findOne({
        where: { slug: tempPost.slug },
      });

      if (existingPost && existingPost.id !== id) {
        // Add timestamp to make slug unique
        const timestamp = Date.now();
        tempPost.slug = `${tempPost.slug}-${timestamp}`;
      }

      // Update the post object directly since slug is not in DTO
      Object.assign(post, updatePostDto);
      post.slug = tempPost.slug;
    } else {
      Object.assign(post, updatePostDto);
    }

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('A post with this slug already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);

    // Soft delete by setting isActive to false
    post.isActive = false;
    await this.postRepository.save(post);
  }

  // Additional utility methods
  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { slug, isActive: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return post;
  }

  async findAllIncludingInactive(): Promise<Post[]> {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
