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
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from '../application/post.service';
import { PostsQueryRepository } from '../infrastructure/repositories/posts.query.repository';
import { PostInputDto } from '../dto/post.input.dto';
import { LikesInputDto } from '../../likes/dto/likes.input.dto';
import { PostsQueryParams } from '../dto/posts-query-params.input-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/repositories/comments.query.repository';
import { CommentsQueryParams } from '../../comments/dto/comments-query-params.input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CommentInputDto } from '../../comments/dto/comment.input.dto';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { ExtractUserFromRequest } from '../../../../core/decorators/transform/extract-user-from-request.decorator';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';
import { UpdateLikeStatusCommand } from '../../likes/application/commands/likes.commands';
import { JwtAuthGuard } from '../../../auth/guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../../core/decorators/transform/extract-user-if-exists-from-request.decorator';
import { BasicAuthGuard } from '../../../auth/guards/basic/basic-auth.guard';
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsService: PostService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Query() query: PostsQueryParams,
    @ExtractUserIfExistsFromRequest() user?: RequestDataEntity,
  ) {
    return this.postsQueryRepository.findAllPosts(query, user?.userId);
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getPost(
    @Param('id') id: string,
    @ExtractUserIfExistsFromRequest() user?: RequestDataEntity,
  ) {
    const post = await this.postsQueryRepository.findById(id, user?.userId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: CommentsQueryParams,
    @ExtractUserIfExistsFromRequest() user?: RequestDataEntity,
  ) {
    return this.commentsQueryRepository.findCommentsByPostId(
      postId,
      query,
      user?.userId,
    );
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto: PostInputDto) {
    return this.postsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() dto: CommentInputDto,
    @ExtractUserFromRequest() user: RequestDataEntity,
  ): Promise<void> {
    return this.commandBus.execute(new CreateCommentCommand(dto, user, postId));
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() dto: PostInputDto) {
    await this.postsService.update(id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @ExtractUserFromRequest() user: RequestDataEntity,
    @Param('postId') postId: string,
    @Body() dto: LikesInputDto,
  ) {
    await this.commandBus.execute(
      new UpdateLikeStatusCommand(user.userId, postId, dto.likeStatus),
    );
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postsService.delete(id);
  }
}
