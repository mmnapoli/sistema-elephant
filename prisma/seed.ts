import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@elephant.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "elephant123";
  const name = process.env.SEED_ADMIN_NAME ?? "Admin elephant.";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role: "ADMIN" },
  });

  console.log(`✔ Usuário admin pronto: ${user.email}`);
  console.log(`  Senha inicial: ${password} (troque após o primeiro login)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
