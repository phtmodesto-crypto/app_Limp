import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EmailCandidaturaData } from "@/lib/email";

const corPrimaria = "#1A3FA0";
const corSecundaria = "#29ABE2";

const competenciasLabel: Record<string, string> = {
  pontualidade: "Pontualidade",
  trabalhoEquipe: "Trabalho em Equipe",
  proatividade: "Proatividade",
  atencaoSeguranca: "Atenção a Normas de Segurança",
  comunicacao: "Comunicação",
};

function estrelas(nota: number): string {
  return "★".repeat(nota) + "☆".repeat(5 - nota);
}

function corClassificacao(c: string): string {
  if (c === "Perfil em Destaque") return "#059669";
  if (c === "Perfil Adequado") return corPrimaria;
  return "#D97706";
}

export function CandidaturaEmail(data: EmailCandidaturaData) {
  const dataFormatada = format(
    new Date(data.createdAt),
    "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
    { locale: ptBR }
  );
  const lgpdFormatada = format(
    new Date(data.lgpdDataHora),
    "dd/MM/yyyy HH:mm:ss",
    { locale: ptBR }
  );

  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>
        Nova candidatura: {data.nomeCompleto} — {data.cargo} | Protocolo {data.protocolo}
      </Preview>
      <Body style={{ backgroundColor: "#F8FAFF", fontFamily: "Arial, sans-serif", margin: 0 }}>
        {/* Header */}
        <Section style={{ backgroundColor: corPrimaria, padding: "24px 0" }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <Text
              style={{
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: "bold",
                margin: "0 0 4px",
              }}
            >
              ★ Grupo Limpservice
            </Text>
            <Text style={{ color: corSecundaria, fontSize: "13px", margin: 0 }}>
              25 Anos de Excelência em Serviços — Sistema de Recrutamento
            </Text>
          </Container>
        </Section>

        {/* Faixa colorida */}
        <Section style={{ backgroundColor: corSecundaria, height: "4px", padding: 0 }} />

        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
          {/* Título */}
          <Section style={{ padding: "32px 0 16px" }}>
            <Heading
              style={{ color: corPrimaria, fontSize: "24px", margin: "0 0 8px", fontWeight: "bold" }}
            >
              📋 Nova Candidatura Recebida
            </Heading>
            <Text style={{ color: "#64748B", margin: 0, fontSize: "14px" }}>
              Recebida em {dataFormatada} · Protocolo:{" "}
              <strong style={{ color: corPrimaria }}>{data.protocolo}</strong>
            </Text>
          </Section>

          {/* Card: Classificação */}
          <Section
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: `2px solid ${corClassificacao(data.classificacao)}`,
              padding: "20px 24px",
              marginBottom: "20px",
            }}
          >
            <Row>
              <Column style={{ width: "60%" }}>
                <Text style={{ margin: "0 0 4px", color: "#64748B", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Classificação Automática
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: corClassificacao(data.classificacao),
                  }}
                >
                  {data.classificacao}
                </Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" }}>
                <Text style={{ margin: "0 0 4px", color: "#64748B", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Pontuação Total
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: corClassificacao(data.classificacao),
                  }}
                >
                  {data.pontuacaoTotal.toFixed(1)}<span style={{ fontSize: "14px" }}>/100</span>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Card: Dados do candidato */}
          <Section
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "20px 24px",
              marginBottom: "16px",
            }}
          >
            <Text style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "bold", color: corPrimaria }}>
              👤 Dados do Candidato
            </Text>
            <Row style={{ marginBottom: "8px" }}>
              <Column style={{ width: "50%" }}>
                <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Nome completo</Text>
                <Text style={{ margin: 0, fontWeight: "bold", color: "#1E293B" }}>{data.nomeCompleto}</Text>
              </Column>
              <Column style={{ width: "50%" }}>
                <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Vaga pretendida</Text>
                <Text style={{ margin: 0, fontWeight: "bold", color: corPrimaria }}>{data.cargo}</Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: "#F1F5F9", margin: "12px 0" }} />
            <Row style={{ marginBottom: "8px" }}>
              <Column style={{ width: "50%" }}>
                <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>E-mail</Text>
                <Link href={`mailto:${data.email}`} style={{ color: corSecundaria }}>{data.email}</Link>
              </Column>
              <Column style={{ width: "50%" }}>
                <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Telefone / WhatsApp</Text>
                <Text style={{ margin: 0, color: "#1E293B" }}>{data.telefone}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: "50%" }}>
                <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Localização</Text>
                <Text style={{ margin: 0, color: "#1E293B" }}>{data.cidade} — {data.estado}</Text>
              </Column>
              <Column style={{ width: "50%" }}>
                <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Turno disponível</Text>
                <Text style={{ margin: 0, color: "#1E293B" }}>{data.turno.join(", ")}</Text>
              </Column>
            </Row>
            {data.pretensaoSalarial ? (
              <Row style={{ marginTop: "8px" }}>
                <Column>
                  <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Pretensão Salarial</Text>
                  <Text style={{ margin: 0, color: "#1E293B" }}>
                    R$ {data.pretensaoSalarial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </Text>
                </Column>
              </Row>
            ) : null}
          </Section>

          {/* Formação */}
          <Section
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "20px 24px",
              marginBottom: "16px",
            }}
          >
            <Text style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "bold", color: corPrimaria }}>
              🎓 Formação
            </Text>
            <Text style={{ margin: "0 0 2px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Escolaridade</Text>
            <Text style={{ margin: "0 0 12px", color: "#1E293B" }}>{data.escolaridade}</Text>
            {data.cursos.length > 0 && (
              <>
                <Text style={{ margin: "0 0 8px", fontSize: "11px", color: "#94A3B8", textTransform: "uppercase" }}>Cursos complementares</Text>
                {data.cursos.map((c, i) => (
                  <Text key={i} style={{ margin: "0 0 4px", color: "#1E293B" }}>
                    • {c.nome}{c.instituicao ? ` — ${c.instituicao}` : ""}{c.ano ? ` (${c.ano})` : ""}
                  </Text>
                ))}
              </>
            )}
          </Section>

          {/* Experiência */}
          {data.experiencias.length > 0 && (
            <Section
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                padding: "20px 24px",
                marginBottom: "16px",
              }}
            >
              <Text style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "bold", color: corPrimaria }}>
                💼 Experiência Profissional
              </Text>
              {data.experiencias.map((exp, i) => (
                <Section key={i} style={{ marginBottom: i < data.experiencias.length - 1 ? "12px" : 0 }}>
                  <Text style={{ margin: "0 0 2px", fontWeight: "bold", color: "#1E293B" }}>
                    {exp.cargo} — {exp.empresa}
                  </Text>
                  <Text style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748B" }}>
                    {exp.dataInicio} até {exp.empregoAtual ? "Atual" : exp.dataFim || "—"}
                  </Text>
                  {i < data.experiencias.length - 1 && <Hr style={{ borderColor: "#F1F5F9", margin: "8px 0" }} />}
                </Section>
              ))}
            </Section>
          )}

          {/* Autoavaliação */}
          <Section
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              padding: "20px 24px",
              marginBottom: "16px",
            }}
          >
            <Text style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "bold", color: corPrimaria }}>
              ⭐ Autoavaliação Profissional
            </Text>
            {Object.entries(data.autoavaliacao).map(([key, val]) => (
              <Row key={key} style={{ marginBottom: "8px" }}>
                <Column style={{ width: "60%" }}>
                  <Text style={{ margin: 0, color: "#1E293B", fontSize: "14px" }}>
                    {competenciasLabel[key] || key}
                  </Text>
                </Column>
                <Column style={{ width: "40%", textAlign: "right" }}>
                  <Text style={{ margin: 0, color: "#F59E0B", fontSize: "16px", letterSpacing: "2px" }}>
                    {estrelas(Number(val))}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Currículo */}
          {data.curriculoUrl && (
            <Section style={{ textAlign: "center", marginBottom: "20px" }}>
              <Button
                href={data.curriculoUrl}
                style={{
                  backgroundColor: corSecundaria,
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "15px",
                }}
              >
                📄 Baixar Currículo
              </Button>
            </Section>
          )}

          {/* Link para o painel admin */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Button
              href={data.adminUrl}
              style={{
                backgroundColor: corPrimaria,
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "8px",
                fontWeight: "bold",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              Ver no Painel Admin →
            </Button>
          </Section>

          {/* LGPD */}
          <Section
            style={{
              backgroundColor: "#EEF2FF",
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "24px",
              borderLeft: `4px solid ${corPrimaria}`,
            }}
          >
            <Text style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: "bold", color: corPrimaria }}>
              ✅ Termo LGPD aceito
            </Text>
            <Text style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
              O candidato leu e aceitou o Termo de Consentimento LGPD em{" "}
              <strong>{lgpdFormatada}</strong>.
            </Text>
          </Section>

          {/* Rodapé */}
          <Hr style={{ borderColor: "#E2E8F0" }} />
          <Text style={{ color: "#94A3B8", fontSize: "12px", textAlign: "center", padding: "16px 0" }}>
            Este e-mail foi gerado automaticamente pelo sistema de recrutamento do Grupo Limpservice.{"\n"}
            Protocolo: <strong>{data.protocolo}</strong> · Enviado em {dataFormatada}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default CandidaturaEmail;
