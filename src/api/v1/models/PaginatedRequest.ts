import { Expose } from 'class-transformer';
import { IsIn, IsInt, IsPositive, Max } from 'class-validator';
import { Constants } from '../../../constants';
import { OrderByDir, OrderByDirs } from '../../../types/OrderByDir';
import { equalsAnyCase } from '../../../utils/checkUtils';
import { toInt } from '../../../utils/stringUtils';
import { BaseValidatable } from '../../../validation/BaseValidatable';
import { IValidatable } from '../../../validation/interfaces/IValidatable';

export abstract class PaginatedRequest<TItem extends IValidatable, TOrderBy extends keyof TItem> extends BaseValidatable {

  public constructor(
    pageIndex: number | string | undefined,
    pageSize: number | string | undefined,
    orderByDir: OrderByDir | undefined) {

    super();

    this.pageIndex = pageIndex ? (toInt(pageIndex) ?? 0) : Constants.DEFAULTS.PAGE_INDEX;
    this.pageSize = pageSize ? (toInt(pageSize) ?? 0) : Constants.DEFAULTS.PAGE_SIZE;
    this.orderByDir = orderByDir ? OrderByDirs.find((validOrderByDir: OrderByDir) => equalsAnyCase(validOrderByDir, orderByDir))! : Constants.ORDER_BY_DIR.ASC;
  }

  @Expose()
  @IsInt()
  @IsPositive()
  public readonly pageIndex: number;

  @Expose()
  @IsInt()
  @IsPositive()
  @Max(Constants.MAX.PAGE_SIZE)
  public readonly pageSize: number;

  public abstract readonly orderBy: TOrderBy;

  @Expose()
  @IsIn([...OrderByDirs])
  public readonly orderByDir: OrderByDir;
}
