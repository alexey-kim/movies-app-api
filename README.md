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
