import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentDocument, CommentModel } from '../schemas/comment.schema';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentInputDto } from '../../dto/comment.input.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async create(newComment: CommentEntity) {
    const createdComment = await this.commentModel.create(newComment);
    return createdComment.toObject();
  }

  async delete(id: string): Promise<void> {
    const result = await this.commentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Comment not found');
    }
  }

  async update(id: string, dto: CommentInputDto): Promise<void> {
    const result = await this.commentModel
      .updateOne({ _id: id }, { $set: { content: dto.content } })
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('Comment not found');
    }
  }
}
