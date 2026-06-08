import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@grupollimpservice.com.br";
  const senha = process.env.ADMIN_SENHA || "Limpservice@2025";
  const nome = process.env.ADMIN_NOME || "RH Limpservice";

  const hash = await bcrypt.hash(senha, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { nome, senha: hash },
    create: { email, nome, senha: hash },
  });

  console.log(`✅ Admin criado/atualizado: ${admin.email}`);
  console.log(`   Nome: ${admin.nome}`);
  console.log(`   Senha: ${senha} (altere após o primeiro acesso!)`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
