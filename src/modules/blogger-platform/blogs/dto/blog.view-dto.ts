import { BlogDocument } from '../infrastructure/schemas/blog.schema';

export class BlogViewDto {
  id!: string;
  name!: string;
  description!: string;
  websiteUrl!: string;
  isMembership!: boolean;
  createdAt!: string;

  static mapToView(blog: BlogDocument): BlogViewDto {
    const dto = new BlogViewDto();
    dto.id = blog._id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.isMembership = blog.isMembership;
    dto.createdAt = blog.createdAt;
    dto.websiteUrl = blog.websiteUrl;
    return dto;
  }
}
