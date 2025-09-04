import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  NotFoundException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/repositories/blogs.query.repository';
import { BlogsQueryParams } from '../dto/blogs-query-params.input-dto';
import { BlogInputDto } from '../dto/blog.input-dto';
import { PostsQueryParams } from '../../posts/dto/posts-query-params.input-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/repositories/posts.query.repository';
import { PostService } from '../../posts/application/post.service';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-without-blogId.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { BasicAuthGuard } from '../../../auth/guards/basic/basic-auth.guard';
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../../core/decorators/transform/extract-user-if-exists-from-request.decorator';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postService: PostService,
  ) {}

  @Get()
  getBlogs(@Query() query: BlogsQueryParams) {
    return this.blogsQueryRepository.findAllBlogs(query);
  }

  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.blogsQueryRepository.findById(id);
  }

  @Get(':blogId/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostsByBlogId(
    @ExtractUserIfExistsFromRequest() user: RequestDataEntity,
    @Param('blogId') blogId: string,
    @Query() query: PostsQueryParams,
  ) {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.postsQueryRepository.findPostsByBlogId(
      blogId,
      query,
      user.userId,
    );
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  createBlog(@Body() dto: BlogInputDto) {
    return this.commandBus.execute(new CreateBlogCommand(dto));
  }
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() dto: PostInputWithoutBlogIdDto,
  ) {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.postService.createByBlogId(dto, blogId);
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateBlog(@Param('id') id: string, @Body() dto: BlogInputDto) {
    return this.commandBus.execute(new UpdateBlogCommand(id, dto));
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBlog(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }
}
