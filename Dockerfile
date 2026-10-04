FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts load-env.ts ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ENV DATA_SOURCE=db
RUN pnpm build

FROM base AS runtime
ENV NODE_ENV=production PORT=3000 PATH=/app/node_modules/.bin:$PATH
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json prisma.config.ts load-env.ts ./
COPY prisma ./prisma
EXPOSE 3000
CMD ["sh", "-c", "prisma migrate deploy && react-router-serve ./build/server/index.js"]
