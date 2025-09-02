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
} from '@nestjs/common';
import { PostService } from '../application/post.service';
import { LikesService } from '../../likes/application/likes.service';
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
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsService: PostService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getPosts(@Query() query: PostsQueryParams) {
    return this.postsQueryRepository.findAllPosts(query);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsQueryRepository.findById(id);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: CommentsQueryParams,
  ) {
    return this.commentsQueryRepository.findCommentsByPostId(postId, query);
  }

  @Post()
  async createPost(@Body() dto: PostInputDto) {
    return this.postsService.create(dto);
  }

  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() dto: CommentInputDto,
    @ExtractUserFromRequest() user: RequestDataEntity,
  ): Promise<void> {
    return this.commandBus.execute(new CreateCommentCommand(dto, user, postId));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() dto: PostInputDto) {
    await this.postsService.update(id, dto);
  }

  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('postId') postId: string,
    @Body() dto: LikesInputDto,
    //@Req() req,
  ) {
    //const userId = req?.user.id ?? '';
    await this.likesService.updateLikeStatus(postId, postId, dto.likeStatus);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postsService.delete(id);
  }
}
