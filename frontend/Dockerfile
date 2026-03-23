# Base stage
FROM node:lts-alpine AS base
WORKDIR /usr/src/app

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app/.output ./.output
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
