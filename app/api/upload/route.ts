import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Arquivo excede 5 MB" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo inválido. Use PDF, DOC ou DOCX." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const novoNome = `${uuid()}.${ext}`;

    // Em desenvolvimento: salva em public/uploads/
    // Em produção: substitua por Vercel Blob ou S3
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, novoNome), buffer);

    const url = `/uploads/${novoNome}`;

    return NextResponse.json({ url, nome: file.name, tipo: file.type, tamanho: file.size });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro interno no upload" }, { status: 500 });
  }
}
