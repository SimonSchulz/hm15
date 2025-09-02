import { BlogSortBy } from './blogs-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class BlogsQueryParams extends BaseQueryParams {
  sortBy = BlogSortBy.CreatedAt;
  searchNameTerm: string | null = null;
}
