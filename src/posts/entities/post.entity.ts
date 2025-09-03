import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class Post {
  @ApiProperty({ description: 'Unique identifier for the post' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Title of the post' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'URL-friendly slug generated from title' })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ApiProperty({ description: 'Content of the post', required: false })
  @Column({ type: 'text', nullable: true })
  content?: string;

  @ApiProperty({ description: 'Whether the post is active', default: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'When the post was published (user-selected date)',
    required: true,
  })
  @Column({ type: 'datetime', nullable: false })
  publishedAt: Date;

  @ApiProperty({ description: 'When the post was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the post was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
  }
}
