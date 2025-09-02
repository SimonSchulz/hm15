import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BlogDocument, BlogModel } from '../schemas/blog.schema';
import { Blog } from '../../domain/entities/blog.entity';
import { BlogsQueryParams } from '../../dto/blogs-query-params.input-dto';
import { BlogViewDto } from '../../dto/blog.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}

  async findAllBlogs(query: BlogsQueryParams) {
    const filter: FilterQuery<Blog> = {
      deletedAt: null,
    };

    if (query.searchNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchNameTerm, $options: 'i' },
      });
    }

    const blogs = await this.blogModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);
    const items = blogs.map((blog) => BlogViewDto.mapToView(blog));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findById(id: string): Promise<Blog | null> {
    const result = await this.blogModel.findById(id);
    if (!result) {
      throw new NotFoundException('Blog not found');
    }
    return BlogViewDto.mapToView(result);
  }
}
