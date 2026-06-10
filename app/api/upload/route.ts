import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Usa Supabase Storage apenas quando explicitamente habilitado via env
// Em desenvolvimento (USE_SUPABASE_STORAGE != "true") salva em public/uploads
const USE_SUPABASE_STORAGE =
  process.env.USE_SUPABASE_STORAGE === "true" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    if (USE_SUPABASE_STORAGE) {
      return await uploadSupabase(file);
    }

    return await uploadLocal(file);
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro interno no upload" }, { status: 500 });
  }
}

// ─── Supabase Storage ─────────────────────────────────────────────────────────

async function uploadSupabase(file: File) {
  const { uploadCurriculo } = await import("@/lib/supabase/storage");

  // ID temporário para organizar o arquivo no bucket antes de salvar a candidatura
  const tempId = `tmp-${Date.now()}`;
  const result = await uploadCurriculo(file, tempId);

  return NextResponse.json({
    url: result.url,
    path: result.path,
    nome: result.nome,
    tipo: result.tipo,
    tamanho: result.tamanho,
    provider: "supabase",
  });
}

// ─── Armazenamento local (desenvolvimento) ────────────────────────────────────

async function uploadLocal(file: File) {
  const { writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const { v4: uuid } = await import("uuid");

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const novoNome = `${uuid()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, novoNome), buffer);

  return NextResponse.json({
    url: `/uploads/${novoNome}`,
    path: novoNome,
    nome: file.name,
    tipo: file.type,
    tamanho: file.size,
    provider: "local",
  });
}
