FROM node:22-slim AS base
WORKDIR /repo
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile --filter @ecomm/shared --filter @ecomm/web

FROM base AS build
COPY --from=deps /repo /repo
COPY packages/shared packages/shared
COPY apps/web apps/web
RUN pnpm --filter @ecomm/shared run build
RUN pnpm --filter @ecomm/web run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
