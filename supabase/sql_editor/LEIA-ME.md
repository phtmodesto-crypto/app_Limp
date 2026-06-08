# SQL Editor — Grupo Limpservice

Execute os arquivos abaixo **na ordem indicada** no SQL Editor do Supabase.

## Ordem de execução

| Ordem | Arquivo | O que faz |
|---|---|---|
| 1º | `01_tabelas.sql` | Cria as tabelas, índices, triggers e view |
| 2º | `02_seguranca_rls.sql` | Ativa RLS e bloqueia acesso público |
| 3º | `03_storage_bucket.sql` | Cria o bucket privado de currículos |
| 4º | `04_admin_inicial.sql` | Cria o primeiro usuário administrador |

## Como rodar

1. Acesse o painel do Supabase
2. Clique em **SQL Editor** no menu lateral esquerdo
3. Clique em **New query**
4. Cole o conteúdo do arquivo
5. Clique em **Run**
6. Repita para cada arquivo na ordem acima
