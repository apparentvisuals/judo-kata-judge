# Judo Kata Judge

[Website](https://kata-judge.judowaza.org/)

Judo Kata judging software based on IJF ruleset. Open sourced under the AGPL License.

## Setup

1. Login to your Azure account or create one.
2. Create the database.
    1. Create a free Cosmos DB with the database name `judo-kata-judge`.
    2. Create tables without partitioning, choose a partition key that does not exist and will not set a value. e.g. /partitionKey
        - athletes-dev
        - judges-dev
        - tournaments-dev
        - invites-dev
        - matches-dev

3. Create a `.env` file at the root of the repository with at least the follow:

```
AUTH_KEY=<admin_password> # any string to use as local admin password
COSMOS_ENDPOINT=<cosmos_endpoint> # url to your cosmos db
COSMOS_KEY=<cosmos_key> # access key for your cosmos db
```

4. Install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000.

```bash
# npm
npm run dev

# pnpm
pnpm run dev
```

or run `server: nuxt` launch profile in VSCode. (debugging and breakpoints).

The app will create tables with a `-dev` suffix inside the `judo-kata-judge` database.

## Production

The deployment is published from the `main` branch using Github actions as an Azure Web App. Manual deployment
instructions will be added at a later time.
