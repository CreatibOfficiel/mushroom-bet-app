#######################################################################
# Multi-stage Dockerfile for a Next.js + Bun application
# - Clean dev experience, minimal production image, reproducible builds
#######################################################################

# ---- 0️⃣  Common base ------------------------------------------------
# Use a pinned Bun version to guarantee identical behaviour everywhere
ARG BUN_VERSION=1.1.42
FROM oven/bun:${BUN_VERSION}-slim AS base
WORKDIR /app

# Copy manifests first so Docker cache isn’t invalidated by source edits
COPY bun.lockb package.json tsconfig.json ./

# Install *all* dependencies (prod + dev). We’ll prune later.
RUN bun install --frozen-lockfile

# Add build metadata (optional but useful for observability)
LABEL org.opencontainers.image.created="2025-07-05"
LABEL org.opencontainers.image.revision="git-sha-will-be-injected-by-CI"

# ---- 1️⃣  Development image  ----------------------------------------
FROM base AS dev
# Copy the code *after* deps so edits don’t bust the cache layer above
COPY . .

# Hot-reload entrypoint
CMD ["bunx", "next", "dev", "-p", "3000"]

# ---- 2️⃣  Builder (production) --------------------------------------
FROM base AS builder
ENV NODE_ENV=production

# Copy full source and build the standalone output
COPY . .
RUN bunx next build

# Remove dev-only dependencies to keep the final image lean
RUN bun install --production --frozen-lockfile

# ---- 3️⃣  Ultra-light runtime image ---------------------------------
FROM oven/bun:${BUN_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Add an unprivileged user for better security
RUN adduser -D -u 10001 bun

# Copy the standalone server build and static assets
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY --from=builder --chown=bun:bun /app/public        ./public

USER bun          # Drop root privileges
EXPOSE 3000       # Document the port

# The standalone build contains server.js at its root
CMD ["bun", "server.js"]
