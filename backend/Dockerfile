FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma.config.ts ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3333

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
