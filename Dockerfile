ARG BUN_VERSION=1.1.42

#############################
## 1️⃣  DEV Image "hot-reload"
#############################
FROM oven/bun:${BUN_VERSION}-slim AS dev
WORKDIR /app

# Ultra-light copy to install dependencies
COPY bun.lockb ./
COPY package.json tsconfig.json ./
RUN bun install --frozen-lockfile

# Source code
COPY . .

# ► This stage's "CMD" is ONLY used if explicitly targeting "dev"
CMD ["bunx", "next", "dev", "-p", "3000"]


#############################
## 2️⃣  BUILD (Production)
#############################
FROM dev AS builder
ENV NODE_ENV=production

# Build standalone (without --turbo for production)
RUN bunx next build


#############################
## 3️⃣  RUNTIME ultra-light
#############################
FROM oven/bun:${BUN_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# ► Minimal copy: standalone bundle, static and public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["bun", "server.js"]
