import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PostDocument, PostModel } from '../schemas/post.schema';
import { PostsQueryParams } from '../../dto/posts-query-params.input-dto';
import { PostViewDto } from '../../dto/post.view-dto';
import { ExtendedLikesInfo } from '../../../likes/dto/extended-likes-info.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { GetExtendedLikesInfoCommand } from '../../../likes/application/commands/likes.commands';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostDocument>,
    private readonly commandBus: CommandBus,
  ) {}

  async findById(id: string): Promise<PostViewDto> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const extendedLikesInfo: ExtendedLikesInfo = await this.commandBus.execute(
      new GetExtendedLikesInfoCommand(post.id),
    );

    return PostViewDto.mapToView(post, extendedLikesInfo);
  }

  async findAllPosts(
    query: PostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<PostDocument> = { deletedAt: null };

    if (query.searchNameTerm) {
      filter.$or = [{ title: { $regex: query.searchNameTerm, $options: 'i' } }];
    }

    const posts = await this.postModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();

    const totalCount = await this.postModel.countDocuments(filter);

    const items = await Promise.all(
      posts.map(async (post) => {
        const extendedLikesInfo: ExtendedLikesInfo =
          await this.commandBus.execute(
            new GetExtendedLikesInfoCommand(post.id),
          );
        return PostViewDto.mapToView(post, extendedLikesInfo);
      }),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findPostsByBlogId(
    blogId: string,
    query: PostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<PostDocument> = { blogId, deletedAt: null };

    const posts = await this.postModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();

    const totalCount = await this.postModel.countDocuments(filter);

    const items = await Promise.all(
      posts.map(async (post) => {
        const extendedLikesInfo: ExtendedLikesInfo =
          await this.commandBus.execute(
            new GetExtendedLikesInfoCommand(post.id),
          );
        return PostViewDto.mapToView(post, extendedLikesInfo);
      }),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
