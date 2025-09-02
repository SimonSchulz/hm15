import { CommentsSortBy } from './comments-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class CommentsQueryParams extends BaseQueryParams {
  sortBy = CommentsSortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
