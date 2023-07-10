# base node image
FROM node:20-bullseye-slim as base
COPY /apps/discord/fonts ./usr/share/fonts
RUN apt-get update; apt-get install -y fontconfig
RUN fc-cache -f -v
RUN npm install -g pnpm

# Install all node_modules, including dev dependencies
FROM base as deps
WORKDIR /app
COPY . .
RUN pnpm install

# Build the bot
FROM deps as build
RUN pnpm -r build

# Setup production node_modules
FROM build as pruned
WORKDIR /app
RUN mkdir pruned && pnpm --filter discord deploy --prod pruned

# Build the app
FROM base as deploy
WORKDIR /app
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
COPY --from=pruned /app/pruned/dist dist
COPY --from=pruned /app/pruned/node_modules node_modules
COPY --from=pruned /app/pruned/package.json package.json
COPY --from=pruned /app/apps/discord/fonts /app/fonts
COPY --from=pruned /app/apps/discord/start.sh /app/start.sh

RUN ["chmod", "+x", "start.sh"]

ENTRYPOINT [ "./start.sh" ]