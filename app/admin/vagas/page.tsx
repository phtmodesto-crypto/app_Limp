import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VagasManager } from "@/components/admin/VagasManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gestão de Vagas — Admin" };

export default async function VagasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const vagas = await prisma.vaga.findMany({ orderBy: { ordem: "asc" } });

  return (
    <div className="p-4 md:p-8 lg:pl-8 pt-14 lg:pt-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-600">Gestão de Vagas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ative ou desative as vagas que aparecem no site público.
        </p>
      </div>

      <div className="card">
        <VagasManager vagasIniciais={vagas} />
      </div>
    </div>
  );
}
