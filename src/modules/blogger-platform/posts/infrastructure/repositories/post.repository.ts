import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostModel } from '../schemas/post.schema';
import { Model } from 'mongoose';
import { Post } from '../../domain/entities/post.entity';
import { PostInputDto } from '../../dto/post.input.dto';
import { PostViewDto } from '../../dto/post.view-dto';
import { ExtendedLikesInfo } from '../../../likes/dto/extended-likes-info.dto';
@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostDocument>,
  ) {}
  async create(newPostData: Post) {
    const newPost = await this.postModel.create(newPostData);
    const extendedLikesInfo = ExtendedLikesInfo.defaultValues();
    return PostViewDto.mapToView(newPost, extendedLikesInfo);
  }

  async update(id: string, dto: PostInputDto): Promise<void> {
    const result = await this.postModel.updateOne(
      { _id: id },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (result.matchedCount < 1) {
      throw new NotFoundException('Post not exist');
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.postModel.deleteOne({ _id: id });
    if (result.deletedCount < 1) {
      throw new NotFoundException('Post not exist');
    }
  }
}
