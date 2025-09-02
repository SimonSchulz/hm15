import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/repositories/blog.repository';
import { BlogInputDto } from '../../dto/blog.input-dto';

export class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly dto: BlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogCommand, void>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const { id, dto } = command;
    await this.blogsRepository.update(id, dto);
  }
}
