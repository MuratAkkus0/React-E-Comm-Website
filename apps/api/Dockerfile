FROM node:22-slim AS base
WORKDIR /repo
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --filter @ecomm/shared --filter @ecomm/api

FROM base AS build
COPY --from=deps /repo /repo
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @ecomm/shared run build
RUN pnpm --filter @ecomm/api exec prisma generate
RUN pnpm --filter @ecomm/api run build

FROM node:22-slim AS runtime
WORKDIR /repo
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
ENV NODE_ENV=production
COPY --from=build /repo /repo
WORKDIR /repo/apps/api
EXPOSE 9000
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/server.js"]
