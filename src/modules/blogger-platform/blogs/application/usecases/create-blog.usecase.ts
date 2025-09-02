import { BlogInputDto } from '../../dto/blog.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/repositories/blog.repository';
import { Blog } from '../../domain/entities/blog.entity';
import { BlogViewDto } from '../../dto/blog.view-dto';

export class CreateBlogCommand {
  constructor(public readonly dto: BlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, BlogViewDto>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<BlogViewDto> {
    const { dto } = command;
    const newBlog = new Blog(dto.name, dto.description, dto.websiteUrl);
    return this.blogsRepository.create(newBlog);
  }
}
