# Deploy no Coolify — Sistema Elephant

Mesma arquitetura do seu projeto `regallos`: uma **Application** (Nixpacks, auto-deploy do
GitHub) + um **Database** PostgreSQL separado. Sem docker-compose.

## 1. Criar o banco (Database)

1. Coolify → **+ New** → **Database** → **PostgreSQL**.
2. Dê um nome (ex.: `pg-elephant`) e crie.
3. Abra o banco → copie a **Connection String interna** (algo como
   `postgres://postgres:SENHA@<host-interno>:5432/postgres`).
   - Use a **interna** (rede do Coolify), não a pública.

## 2. Criar a aplicação (Application)

1. Coolify → **+ New** → **Application** → **Public/Private Repository**.
2. Selecione este repositório do GitHub e a branch `main`.
3. **Build Pack: Nixpacks** (detecta Next.js automaticamente).
4. Em **Domains**, gere ou informe seu domínio (HTTPS automático do Coolify).
5. **Watch paths / Auto deploy**: deixe ligado para atualizar sozinho a cada push na `main`.

> O start é definido pelo [`nixpacks.toml`](nixpacks.toml):
> `prisma migrate deploy` → seed (idempotente) → `next start`.
> Não precisa preencher Build/Start Command manualmente.

## 3. Variáveis de ambiente (Environment Variables)

No app, aba **Environment Variables**:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a Connection String **interna** do passo 1 (acrescente `?schema=public` se faltar) |
| `AUTH_SECRET` | gere com `npx auth secret` (ou `openssl rand -base64 32`) |
| `OPENAI_API_KEY` | sua chave da OpenAI |
| `AUTH_TRUST_HOST` | `true` |
| `STORAGE_DIR` | `/app/storage` |
| `SEED_ADMIN_EMAIL` | *(opcional)* e-mail do admin inicial |
| `SEED_ADMIN_PASSWORD` | *(opcional)* senha do admin inicial |

## 4. Armazenamento persistente (Persistent Storage)

As imagens geradas/enviadas ficam em disco. Sem volume, elas somem a cada deploy.

1. App → aba **Persistent Storage** → **Add**.
2. Tipo **Volume**, **Mount Path**: `/app/storage`.

## 5. Healthcheck (opcional, recomendado)

A raiz `/` redireciona para o login. Se o healthcheck do Coolify reclamar:
- App → **Healthcheck** → Path: `/login` (responde 200).

## 6. Deploy

Clique em **Deploy**. No primeiro deploy o `nixpacks.toml`:
1. aplica as migrations (`prisma migrate deploy`),
2. cria o admin (`admin@elephant.local` / `elephant123` — troque depois),
3. sobe o Next.js.

A partir daí, **cada push na `main` redeploya automaticamente**.

## Atualizações futuras de schema

Quando mudar o `prisma/schema.prisma`, gere uma nova migration localmente (com um Postgres
acessível) e faça commit dela:

```bash
npm run db:migrate -- --name descricao_da_mudanca
git add prisma/migrations && git commit -m "db: ..." && git push
```

O Coolify aplica a nova migration no próximo deploy via `prisma migrate deploy`.
