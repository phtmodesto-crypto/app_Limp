# Grupo Limpservice — Sistema de Avaliação Curricular

Aplicativo web responsivo (mobile-first) para recebimento e avaliação de currículos do **Grupo Limpservice**, empresa de terceirização de serviços com 25 anos de mercado.

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS |
| Banco de dados | SQLite (dev) / PostgreSQL (produção) via Prisma |
| E-mail | Resend + React Email |
| Upload | Local (`/public/uploads`) em dev / Vercel Blob em prod |
| Autenticação | NextAuth.js (Credentials Provider) |
| Validação | Zod + React Hook Form |
| Deploy | Vercel |

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Resend](https://resend.com) (para envio de e-mails)

---

## Configuração local

### 1. Clone e instale as dependências

```bash
git clone <seu-repositorio>
cd limpservice-curriculos
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e preencha:

```env
# Banco de dados (SQLite para dev)
DATABASE_URL="file:./dev.db"

# NextAuth — gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Resend API
RESEND_API_KEY="re_xxxxxxxxxxxx"
RH_EMAIL="rh@suaempresa.com.br"
EMAIL_FROM="curriculos@suaempresa.com.br"

# Admin padrão
ADMIN_EMAIL="admin@grupollimpservice.com.br"
ADMIN_SENHA="Limpservice@2025"
ADMIN_NOME="RH Limpservice"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Inicialize o banco de dados

```bash
# Cria o banco SQLite e aplica o schema
npm run db:push

# Cria o usuário admin padrão
npm run db:seed
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Rotas principais

| Rota | Descrição |
|---|---|
| `/` | Página de boas-vindas e vagas |
| `/candidatura` | Formulário multi-etapas para candidatos |
| `/confirmacao/[protocolo]` | Página de confirmação após envio |
| `/politica-de-privacidade` | Política de privacidade (LGPD) |
| `/admin` | Dashboard do painel administrativo |
| `/admin/login` | Login do RH |
| `/admin/candidatos` | Lista e filtros de candidaturas |
| `/admin/candidatos/[id]` | Detalhe completo do candidato |

## API Routes

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/candidaturas` | POST | Submete nova candidatura |
| `/api/upload` | POST | Upload de currículo |
| `/api/admin/candidaturas` | GET | Lista candidaturas (admin) |
| `/api/admin/candidaturas/[id]` | GET/PATCH | Detalhe e atualização de status |
| `/api/admin/candidaturas/[id]/anonimizar` | POST | Anonimiza dados (LGPD) |
| `/api/admin/stats` | GET | Estatísticas do dashboard |
| `/api/admin/export` | GET | Exporta lista em XLSX |

---

## Sistema de pontuação

A pontuação total do candidato (0–100) é composta por:

### Autoavaliação (máx. 60 pontos)
O candidato avalia 5 competências de 1 a 5 estrelas:
- Pontualidade
- Trabalho em Equipe
- Proatividade
- Atenção a Normas de Segurança
- Comunicação

Fórmula: `(soma_das_notas / 25) × 60`

### Completude do perfil (máx. 40 pontos)
| Item | Pontos |
|---|---|
| Dados pessoais completos | 5 |
| Cidade e estado | 5 |
| Vaga e turno selecionados | 5 |
| 1+ experiência profissional | 10 |
| 2+ experiências profissionais | +5 |
| Escolaridade informada | 5 |
| 1+ curso complementar | 5 |
| Currículo enviado | 5 |

### Classificação
| Faixa | Classificação |
|---|---|
| ≥ 80 pontos | Perfil em Destaque |
| 60–79 pontos | Perfil Adequado |
| < 60 pontos | Em Análise |

> A classificação é exibida **somente** no painel admin e no e-mail ao RH — nunca ao candidato.

---

## Comandos úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia produção
npm run db:push      # Aplica schema ao banco (sem migração)
npm run db:migrate   # Cria e aplica migração (PostgreSQL)
npm run db:seed      # Cria usuário admin padrão
npm run db:studio    # Abre Prisma Studio (GUI do banco)
```

---

## Deploy na Vercel

### 1. Banco de dados PostgreSQL

Em produção, use PostgreSQL. Recomendado: [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (free tier).

Atualize o `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

E o `DATABASE_URL` nas variáveis de ambiente da Vercel.

### 2. Variáveis de ambiente na Vercel

Configure todas as variáveis do `.env.example` no painel da Vercel:
- Settings → Environment Variables

### 3. Migração do banco

Após configurar o `DATABASE_URL` PostgreSQL, execute localmente:

```bash
npx prisma migrate deploy
npm run db:seed
```

### 4. Storage de currículos

Para upload em produção, recomendamos **Vercel Blob**:

```bash
npm install @vercel/blob
```

Substitua o código em `app/api/upload/route.ts`:

```typescript
import { put } from "@vercel/blob";

// Dentro do handler POST:
const blob = await put(novoNome, file, {
  access: "public",
  contentType: file.type,
});
return NextResponse.json({ url: blob.url, ... });
```

### 5. Deploy

```bash
vercel --prod
```

---

## Segurança e LGPD

### Medidas implementadas

- **Rate limiting**: máximo 5 candidaturas por IP por minuto
- **Honeypot**: campo oculto para detectar e rejeitar bots silenciosamente
- **Validação completa**: Zod + React Hook Form em cada etapa
- **Autenticação JWT**: sessão de 8h para o painel admin
- **Middleware de proteção**: todas as rotas `/admin/*` (exceto login) exigem autenticação
- **LGPD**: campo de consentimento obrigatório com registro de data/hora
- **Anonimização**: botão no painel para excluir dados pessoais (direito de exclusão)
- **Dados confidenciais**: classificação e pontuação nunca exibidas ao candidato

### Variáveis sensíveis

Nunca commite o arquivo `.env` com valores reais. Use `.env.example` como modelo.

---

## Estrutura do projeto

```
app/
├── page.tsx                    # Página inicial (vagas e boas-vindas)
├── candidatura/page.tsx        # Formulário multi-etapas
├── confirmacao/[protocolo]/    # Confirmação de envio
├── politica-de-privacidade/    # Política de privacidade (LGPD)
├── admin/
│   ├── login/page.tsx          # Login do RH
│   ├── page.tsx                # Dashboard
│   └── candidatos/
│       ├── page.tsx            # Lista de candidatos
│       └── [id]/page.tsx       # Detalhe do candidato
└── api/
    ├── auth/[...nextauth]/     # NextAuth handler
    ├── candidaturas/           # Submissão de candidatura
    ├── upload/                 # Upload de currículo
    └── admin/                  # APIs protegidas do painel

components/
├── candidatura/                # Steps do formulário
└── admin/                      # Componentes do painel

emails/
└── CandidaturaEmail.tsx        # Template React Email

lib/
├── prisma.ts                   # Cliente Prisma (singleton)
├── auth.ts                     # Config NextAuth
├── scoring.ts                  # Lógica de pontuação
├── validations.ts              # Schemas Zod
└── email.ts                    # Serviço de envio Resend

prisma/
├── schema.prisma               # Schema do banco
└── seed.ts                     # Criação do admin inicial
```

---

## Suporte e contato

Para dúvidas sobre o sistema, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

*Desenvolvido com Next.js 14, Tailwind CSS, Prisma e Resend.*
