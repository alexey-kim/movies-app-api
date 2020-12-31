import { Constants } from '../constants';

export const OrderByDirs = [
  Constants.ORDER_BY_DIR.ASC,
  Constants.ORDER_BY_DIR.DESC
] as const;

export type OrderByDir = typeof OrderByDirs[number];
