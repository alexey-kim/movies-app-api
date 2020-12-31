export const MovieOrderBys = [
  'title',
  'rating',
  'releaseDate'
] as const;

export type MovieOrderBy = typeof MovieOrderBys[number];
