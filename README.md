# elephant. — Gerador de Artes por Cliente

Sistema web interno da agência **elephant.** para gerar artes de redes sociais
(Instagram Feed, Instagram Story, Facebook Feed) com consistência visual por cliente,
usando a API de imagem da OpenAI (`gpt-image-1`).

A IA gera o **visual de fundo**; o texto (principal, secundário, CTA) e o logo entram como
**camadas editáveis** num editor de canvas — fonte, cor e posição ajustáveis. O sistema
nunca inventa textos que não foram informados.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Auth.js v5** (login email/senha, papéis `ADMIN`/`EQUIPE`)
- **Prisma 7** + **PostgreSQL** (driver adapter `@prisma/adapter-pg`)
- **OpenAI** `gpt-image-1`
- **react-konva** (editor de camadas)
- Deploy: **Docker** + **Caddy** (HTTPS automático)

## Desenvolvimento local

Pré-requisitos: Node 20+ e um PostgreSQL acessível.

```bash
# 1. Dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
#  - defina DATABASE_URL (Postgres local ou da VPS)
#  - gere AUTH_SECRET:  npx auth secret
#  - defina OPENAI_API_KEY

# 3. (Opcional) Postgres local via Docker
docker compose -f docker-compose.dev.yml up -d

# 4. Banco: migrations + usuário admin
npm run db:migrate     # cria as tabelas
npm run db:seed        # cria o admin (admin@elephant.local / elephant123)

# 5. Rodar
npm run dev            # http://localhost:3000
```

### Scripts úteis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e execução de produção |
| `npm run db:migrate` | Cria/aplica migrations (dev) |
| `npm run db:deploy` | Aplica migrations (produção) |
| `npm run db:seed` | Cria o usuário admin |
| `npm run db:studio` | Prisma Studio (inspecionar o banco) |

## Deploy no Coolify (Nixpacks + Postgres separado)

Passo a passo completo em **[COOLIFY.md](COOLIFY.md)**. Resumo:

1. **Database** → novo PostgreSQL no Coolify (anote a *Internal Connection String*).
2. **Application** → conecte este repositório GitHub, Build Pack **Nixpacks** (auto-deploy na `main`).
3. **Environment Variables** do app:
   - `DATABASE_URL` = connection string interna do Postgres do Coolify
   - `AUTH_SECRET` = `npx auth secret`
   - `OPENAI_API_KEY` = sua chave
   - `AUTH_TRUST_HOST=true`, `STORAGE_DIR=/app/storage`
4. **Persistent Storage** → monte um volume em `/app/storage` (preserva as imagens entre deploys).
5. **Deploy.** O [nixpacks.toml](nixpacks.toml) roda `prisma migrate deploy` + seed e sobe o app.

> O `migrate deploy` aplica as migrations versionadas em `prisma/migrations/` e o seed cria o
> admin inicial (`admin@elephant.local` / `elephant123`) de forma idempotente.

### Backups
- Banco: use o backup automático do recurso PostgreSQL no Coolify.
- Imagens: faça backup do volume persistente montado em `/app/storage`.

## Estrutura

```
src/
  app/
    (app)/            páginas autenticadas (dashboard, clients, generate, editor, history)
    api/              generate, files, upload, generations/[id]/composition, auth
    login/            tela de login
  components/         UI, sidebar, formulários, wizard, editor (Konva)
  lib/                prisma, auth, openai, prompt-builder, storage, formats, validation
  generated/prisma/   Prisma Client gerado
prisma/               schema.prisma, seed.ts
```

## Fluxo de geração

1. Escolha cliente → formato → briefing (textos opcionais + referência opcional).
2. `lib/prompt-builder.ts` monta o prompt final (perfil do cliente + formato + briefing),
   instruindo a IA a **não** desenhar texto e a **não** inventar conteúdo.
3. `POST /api/generate` chama o `gpt-image-1`, salva a imagem de fundo e registra a geração.
4. O **editor** abre com o fundo + textos/logo como camadas editáveis.
5. Salvar exporta o PNG final composto e grava no histórico (imagem + prompt + metadados).

## Evolução planejada
- Aprovação de cliente (status + papel `CLIENTE` + link compartilhável)
- Calendário de publicações (`ScheduledPost`)
- Relatórios (volume por cliente/período)
- Templates de prompt por formato/cliente
