// Da mais fiel para a mais leve; a primeira já resolve quase todas as fotos de celular
const TENTATIVAS = [
  { ladoMaximo: 2400, qualidade: 0.85 },
  { ladoMaximo: 2000, qualidade: 0.75 },
  { ladoMaximo: 1600, qualidade: 0.7 },
];

export async function comprimirImagem(file: File, limiteBytes: number): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const maiorLado = Math.max(img.naturalWidth, img.naturalHeight);

    for (const { ladoMaximo, qualidade } of TENTATIVAS) {
      const escala = Math.min(1, ladoMaximo / maiorLado);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * escala);
      canvas.height = Math.round(img.naturalHeight * escala);
      const ctx = canvas.getContext("2d");
      if (!ctx) break;
      // JPEG não tem transparência: sem fundo branco, PNG transparente fica preto
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", qualidade)
      );
      if (blob && blob.size <= limiteBytes) {
        const nome = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        return new File([blob], nome, { type: "image/jpeg" });
      }
    }
  } finally {
    URL.revokeObjectURL(url);
  }
  throw new Error("Não foi possível reduzir a imagem");
}
