import { PostsSortBy } from './posts-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class PostsQueryParams extends BaseQueryParams {
  sortBy = PostsSortBy.CreatedAt;
  searchNameTerm: string | null = null;
}
