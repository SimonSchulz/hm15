import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, BlogModel } from '../schemas/blog.schema';
import { Blog } from '../../domain/entities/blog.entity';
import { BlogInputDto } from '../../dto/blog.input-dto';
import { BlogViewDto } from '../../dto/blog.view-dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}
  async create(newBlog: Partial<Blog>): Promise<BlogViewDto> {
    const createdBlog = await this.blogModel.create(newBlog);
    return BlogViewDto.mapToView(createdBlog);
  }

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const updateResult = await this.blogModel.updateOne(
      { _id: id },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new NotFoundException('Blog not exist');
    }
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.blogModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Blog not exist');
    }
  }
}
