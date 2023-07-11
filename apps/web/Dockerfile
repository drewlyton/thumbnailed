# base node image
FROM node:20-bullseye-slim as base
RUN apt-get update && apt-get install -y openssl sqlite3
RUN npm install -g pnpm

# Install all node_modules, including dev dependencies
FROM base as deps
WORKDIR /myapp
COPY . .
RUN pnpm install

# Build the bot
FROM deps as build
RUN pnpm -r build
RUN pnpm web db:generate

# Setup production node_modules
FROM build as pruned
WORKDIR /myapp
RUN mkdir pruned && pnpm --filter web deploy --prod pruned

# Build the app
FROM base as deploy
WORKDIR /myapp
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"
# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli
COPY --from=pruned /myapp/pruned/node_modules /myapp/node_modules
COPY --from=pruned /myapp/pruned/build /myapp/build
COPY --from=pruned /myapp/pruned/public /myapp/public
COPY --from=pruned /myapp/pruned/package.json /myapp/package.json
COPY --from=pruned /myapp/apps/web/start.sh /myapp/start.sh
COPY --from=pruned /myapp/apps/web/node_modules/@prisma /myapp/node_modules/@prisma
COPY --from=pruned /myapp/apps/web/prisma /myapp/prisma

RUN ["chmod", "+x", "start.sh"]

ENTRYPOINT [ "./start.sh" ]
