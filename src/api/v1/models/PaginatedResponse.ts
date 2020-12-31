import { Expose } from 'class-transformer';
import { IsArray, IsInt, IsPositive, Min, ValidateNested } from 'class-validator';
import { BaseValidatable } from '../../../validation/BaseValidatable';
import { IValidatable } from '../../../validation/interfaces/IValidatable';

export class PaginatedResponse<TItem extends IValidatable> extends BaseValidatable {

  public constructor(
    pageIndex: number,
    pageSize: number,
    totalItems: number,
    items: TItem[]) {

    super();

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.items = items;
  }

  @Expose()
  @IsInt()
  @IsPositive()
  public readonly pageIndex: number;

  @Expose()
  @IsInt()
  @IsPositive()
  public readonly pageSize: number;

  @Expose()
  @IsInt()
  @Min(0)
  public readonly totalItems: number;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  public readonly items: TItem[];
}
