import { BaseQueryParams } from '../../../core/dto/base.query-params.input-dto';
import { UsersSortBy } from './users-sort-by';
import { IsEnum, IsOptional } from 'class-validator';
export class UsersQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;
  @IsOptional()
  searchLoginTerm: string | null = null;
  @IsOptional()
  searchEmailTerm: string | null = null;
}
