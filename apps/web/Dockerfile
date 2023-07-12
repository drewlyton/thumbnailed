# base node image
FROM node:20-bullseye-slim as base
RUN apt-get update && apt-get install -y openssl sqlite3
RUN npm install -g pnpm

# Install all dependencies (including dev) in all packages
FROM base as deps
WORKDIR /myapp
ADD pnpm-lock.yaml ./
# Load packages in virtual store https://pnpm.io/cli/fetch
RUN pnpm --filter @thumbnailed/web fetch
ADD . ./
# Install all dependencies
RUN pnpm install

# Build the app
FROM deps as build
WORKDIR /myapp
# Run prisma generate command
RUN pnpm web db:generate
# Build all packages
RUN pnpm -r build

# Setup production node_modules
FROM base as pruned-deps
WORKDIR /myapp
# Copy over repo level dependencies (should include package deps cause of pnpm fetch call)
COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY --from=deps /myapp/.npmrc /myapp/.npmrc
COPY --from=deps /myapp/pnpm-lock.yaml /myapp/pnpm-lock.yaml
COPY --from=deps /myapp/pnpm-workspace.yaml /myapp/pnpm-workspace.yaml
COPY --from=deps /myapp/package.json /myapp/package.json
# Copy over web app dependencies
COPY --from=deps /myapp/apps/web/node_modules /myapp/apps/web/node_modules
COPY --from=deps /myapp/apps/web/package.json /myapp/apps/web/package.json
# Prune the deps
RUN pnpm prune --prod

# Build the app
FROM pruned-deps as deploy
WORKDIR /myapp
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"
# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

COPY --from=build /myapp/apps/web/build /myapp/apps/web/build
COPY --from=build /myapp/apps/web/public /myapp/apps/web/public
COPY --from=build /myapp/apps/web/prisma /myapp/apps/web/prisma
COPY ./apps/web/start.sh /myapp/apps/web/start.sh

WORKDIR /myapp/apps/web

RUN ["chmod", "+x", "start.sh"]

ENTRYPOINT [ "./start.sh" ]
