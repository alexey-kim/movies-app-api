## Requirements
- Node v12 or newer
- NPM or Yarn

## Installation

```bash
git clone https://github.com/alexey-kim/movies-app-api.git

cd movies-app-api

# Create .env file
# Change port if necessary. Default is 3001
cp .env.sample .env

yarn install
```

## Running the application

```bash
# Development mode
yarn start

# Production mode
yarn build && yarn start:localprod
```

## Testing

```bash
# Unit tests
yarn test

# Unit tests with coverage
yarn test:cov
```

# Features
- Stack consists of Node, Typescript in strict mode, Express, MongoDB, Inversify (DI).
- Code demonstrates concepts like abstractions, generic types, dependency injection, type safety, validation, configuration, localisation, etc.
- APIs:
  * All endpoints are versioned (currently */api/v1* only).
  * All endpoints that return lists of items (e.g. */api/v1/movies*) are paginated (*pageIndex*, *pageSize*) and sortable (*orderBy*, *orderByDir*).
  * All *orderBy* parameters are validated against the target model properties (e.g. *title*, *rating*, *releaseDate* for movies).
  * Using a generic method *BaseService._executeWithValidation* to validate all request inputs and response outputs inside Movie service in a generic way.
- Configuration:
  * Type safe and fully validated upon application start (e.g. *APP_PORT* is checked to be a valid positive integer, etc).
  * Supports .env file as well as environment variables that are passed to the process directly.
- Database:
  * Using in-memory MongoDB to avoid the need to install it for this demo. Obviously, for production release this needs to be changed to a real database. But apart from that, it's the same MongoDB engine and interaction with it is done in the same way as if it were a real database.
  * MongoDB is chosen over SQL databases due to the fact that the majority of queries will be for reading, not writing. So this allows to avoid multiple joins that are very likely in SQL databases.
  * Content (e.g. titles, picture URLs, descriptions) is localised with support for *en*, *en-CA*, *en-GB* locales.
  * Upon application start the database is seeded with 400 movies.
- Exception handling:
  * All error responses are standard.
  * Each error response contains HTTP status code, short error code (e.g. *movieDetailByCodeNotFound*) and error details (e.g. which specific code was not found). So that the consumer of API would have all information to construct a localised error message if needed.
- Validation and serialisation:
  * All models are validatable and serialisable.
- Performance and security:
  * All large responses are compressed.
  * All responses contain security headers with the help of *Helmet* package.
  * *x-powered-by: Express* response header is removed.
- Testability
  * *Inversify* is used as a solution for dependency injection. The following services are registered in its container:
    * Config
    * Movie service
    * Movie database repository
## TODO
* Tests (though code should be testable).
* Create NPM package for code that is shared between back end and front end.
* Logging service (not *console.log*).
* Add request correlation ID (unique per each request) which should be used in logging to group logs by request. Also need to return this correlation ID as *x-request-id* response header with all responses from APIs (especially with error responses).
* Swagger.
* etc.
