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
    try {
      // Set default publishedAt to current Jakarta time if not provided
      const postData = {
        ...createPostDto,
        publishedAt: createPostDto.publishedAt || this.getJakartaTime(),
      };

      // Create a new post instance to trigger slug generation
      const post = this.postRepository.create(postData);

      // Ensure unique slug
      post.slug = await this.generateUniqueSlug(post.slug);

      return await this.postRepository.save(post);
    } catch (error) {
      // Handle specific database constraint errors
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        //error 409
        throw new ConflictException(
          `A post with the title "${createPostDto.title}" already exists or creates a conflicting slug. Please try a different title.`
        );
      }

      // Handle validation errors
      if (error.name === 'QueryFailedError') {
        throw new ConflictException(`Unable to create post: ${error.message}`);
      }

      // Log unexpected errors for debugging
      console.error('Unexpected error creating post:', error);
      throw new ConflictException(
        'Unable to create post due to a conflict. Please try again with a different title.'
      );
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
    try {
      const post = await this.findOne(id);

      // If title is being updated, regenerate slug
      if (updatePostDto.title && updatePostDto.title !== post.title) {
        const tempPost = this.postRepository.create({
          ...post,
          ...updatePostDto,
        });

        // Generate unique slug for the new title
        const uniqueSlug = await this.generateUniqueSlugForUpdate(
          tempPost.slug,
          id
        );

        // Update the post object
        Object.assign(post, updatePostDto);
        post.slug = uniqueSlug;
      } else {
        Object.assign(post, updatePostDto);
      }

      return await this.postRepository.save(post);
    } catch (error) {
      // Handle specific database constraint errors
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException(
          `Unable to update post: The title "${updatePostDto.title}" conflicts with an existing post. Please try a different title.`
        );
      }

      // Handle validation errors
      if (error.name === 'QueryFailedError') {
        throw new ConflictException(`Unable to update post: ${error.message}`);
      }

      // Log unexpected errors for debugging
      console.error('Unexpected error updating post:', error);
      throw new ConflictException(
        'Unable to update post due to a conflict. Please try again.'
      );
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

  // Helper method to generate a unique slug
  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Keep checking until we find a unique slug
    while (await this.slugExists(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;

      // Prevent infinite loops (safety check)
      if (counter > 100) {
        uniqueSlug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    return uniqueSlug;
  }

  // Helper method to check if slug exists
  private async slugExists(slug: string): Promise<boolean> {
    const existingPost = await this.postRepository.findOne({
      where: { slug },
    });
    return !!existingPost;
  }

  // Helper method to generate unique slug for updates (excludes current post)
  private async generateUniqueSlugForUpdate(
    baseSlug: string,
    excludeId: number
  ): Promise<string> {
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Keep checking until we find a unique slug (excluding the current post)
    while (await this.slugExistsExcludingId(uniqueSlug, excludeId)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;

      // Prevent infinite loops (safety check)
      if (counter > 100) {
        uniqueSlug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    return uniqueSlug;
  }

  // Helper method to check if slug exists excluding a specific ID
  private async slugExistsExcludingId(
    slug: string,
    excludeId: number
  ): Promise<boolean> {
    const existingPost = await this.postRepository.findOne({
      where: { slug },
    });
    return !!existingPost && existingPost.id !== excludeId;
  }

  // Helper method to get current time in Jakarta timezone (GMT+7)
  private getJakartaTime(): Date {
    const now = new Date();
    // Jakarta is GMT+7, so add 7 hours (7 * 60 * 60 * 1000 milliseconds)
    const jakartaOffset = 7 * 60 * 60 * 1000;
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const jakartaTime = new Date(utcTime + jakartaOffset);
    return jakartaTime;
  }
}
