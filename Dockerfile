# Build pack: Dockerfile (Coolify) — Node fixo em 22.x (>=22.12, exigido pelo Prisma 7)
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copia tudo antes do install para o postinstall (prisma generate) achar o schema
COPY . .

# Instala deps (inclui dev p/ o build) e gera o Prisma Client (postinstall)
RUN npm ci

# Build do Next.js
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# No start: aplica migrations, garante o admin (seed idempotente) e sobe o Next.
CMD ["sh", "-c", "npx prisma migrate deploy && (npx prisma db seed || true) && npm run start"]
