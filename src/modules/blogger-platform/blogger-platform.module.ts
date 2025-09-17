import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs/controllers/blogs.controller';
import { BlogsQueryRepository } from './blogs/infrastructure/repositories/blogs.query.repository';
import { BlogsRepository } from './blogs/infrastructure/repositories/blog.repository';
import {
  BlogModel,
  BlogSchema,
} from './blogs/infrastructure/schemas/blog.schema';
import {
  PostModel,
  PostSchema,
} from './posts/infrastructure/schemas/post.schema';
import {
  CommentModel,
  CommentSchema,
} from './comments/infrastructure/schemas/comment.schema';
import {
  LikeModel,
  LikeSchema,
} from './likes/infrasructure/schemas/likes.schema';
import { PostService } from './posts/application/post.service';
import { PostsQueryRepository } from './posts/infrastructure/repositories/posts.query.repository';
import { PostsRepository } from './posts/infrastructure/repositories/post.repository';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments/controllers/comment.controller';
import { PostsController } from './posts/controllers/posts.controller';
import { CommentsQueryRepository } from './comments/infrastructure/repositories/comments.query.repository';
import { CommentsRepository } from './comments/infrastructure/repositories/comments.repository';
import { LikesRepository } from './likes/infrasructure/repositories/likes.repository';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { GetLikesInfoHandler } from './likes/application/usecases/get-likes-info.usecase';
import { GetExtendedLikesInfoHandler } from './likes/application/usecases/get-extended-info.usecase';
import { UpdateLikeStatusHandler } from './likes/application/usecases/update-like-status';
import {
  SessionDevice,
  SessionDeviceSchema,
} from '../sessions/infrastructure/schemas/session-device.schema';
import { SessionDevicesQueryRepository } from '../sessions/infrastructure/repositories/session.query.repository';
import { SessionDevicesRepository } from '../sessions/infrastructure/repositories/session.repository';
import { RefreshTokenGuard } from '../auth/guards/bearer/refresh.guard';
import { SessionsModule } from '../sessions/session.module';
const blogUseCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];
const commentUseCases = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
];
const likesUseCases = [
  GetLikesInfoHandler,
  GetExtendedLikesInfoHandler,
  UpdateLikeStatusHandler,
];

@Module({
  imports: [
    CqrsModule,
    SessionsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: BlogModel.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: PostModel.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: LikeModel.name, schema: LikeSchema }]),
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([
      { name: SessionDevice.name, schema: SessionDeviceSchema },
    ]),
    UsersModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    ...likesUseCases,
    ...blogUseCases,
    ...commentUseCases,
    BlogsQueryRepository,
    BlogsRepository,
    PostService,
    PostsQueryRepository,
    PostsRepository,
    CommentsQueryRepository,
    CommentsRepository,
    LikesRepository,
    SessionDevicesQueryRepository,
    SessionDevicesRepository,
    RefreshTokenGuard,
  ],
  exports: [RefreshTokenGuard],
})
export class BloggerPlatformModule {}
