export const Constants = {
  DEFAULTS: {
    APP_PORT: 3001,
    LOCALE: 'en',
    PAGE_INDEX: 1,
    PAGE_SIZE: 20
  },
  DI: {
    CONFIG: Symbol('Config'),
    MOVIE_CONTROLLER_V1: Symbol('MovieControllerV1'),
    MOVIE_SERVICE_V1: Symbol('MovieServiceV1'),
    MOVIE_REPOSITORY_V1: Symbol('MovieRepositoryV1')
  },
  MAX: {
    PAGE_SIZE: 500
  },
  NODE_ENVS: {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development'
  },
  ORDER_BY_DIR: {
    ASC: 'asc',
    DESC: 'desc'
  },
  PATHS: {
    DOT_ENV: '.env'
  },
  QUERY_PARAMS: {
    PAGE_INDEX: 'pageIndex',
    PAGE_SIZE: 'pageSize',
    ORDER_BY: 'orderBy',
    ORDER_BY_DIR: 'orderByDir'
  },
  REQUEST_PARAMS: {
    CODE: 'code'
  }
} as const;
