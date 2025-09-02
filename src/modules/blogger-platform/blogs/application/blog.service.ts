import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repositories/blog.repository';
import { Blog } from '../domain/entities/blog.entity';
import { BlogInputDto } from '../dto/blog.input-dto';

@Injectable()
export class BlogService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async create(dto: BlogInputDto): Promise<Blog> {
    const newBlog = new Blog(dto.name, dto.description, dto.websiteUrl);
    return this.blogsRepository.create(newBlog);
  }

  async update(id: string, dto: BlogInputDto): Promise<void> {
    await this.blogsRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
  }
}
