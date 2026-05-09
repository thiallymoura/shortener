# URL Shortener

Aplicação fullstack para gerenciamento de links encurtados, permitindo criação, listagem, redirecionamento, remoção e exportação de relatórios CSV.
O projeto é dividido em:

- `server` → API backend
- `web` → aplicação frontend SPA
  
---

# Tecnologias

## Backend

- Node.js
- TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- Zod
- Cloudflare R2 (exportação CSV)

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS

---

# Funcionalidades

## Backend

- Criar link encurtado
- Listar links
- Buscar URL original por shortUrl
- Incrementar accessCount automaticamente
- Remover link
- Exportar CSV
- Gerar URL pública do CSV via Cloudflare R2
- Validações completas
- Tratamento de erros
- Testes automatizados

## Frontend

- Cadastro de links
- Listagem de links
- Redirect automático
- Cópia de link encurtado
- Exclusão com modal de confirmação
- Exportação CSV
- Toasts de feedback
- Loading states
- Empty states
- Página 404
- Responsividade desktop/mobile

---

# Estrutura do Projeto

```txt
.
├── server
│   ├── src
│   ├── prisma
│   └── docker
│
└── web
    ├── src
    └── public
  
```

---

# Variáveis de Ambiente

## Backend (`server/.env`)

```env
DATABASE_URL=

PORT=

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET=
CLOUDFLARE_PUBLIC_URL=
```

## Frontend (`web/.env`)

```env
VITE_BACKEND_URL=
VITE_FRONTEND_URL=
```

---

# Executando o Backend

## 1. Instalar dependências

```bash
npm install
```

## 2. Subir banco PostgreSQL

```bash
docker compose up -d
```

## 3. Executar migrations

```bash
npm run db:migrate
```

## 4. Rodar backend

```bash
npm run dev
```

Servidor padrão:

```txt
http://localhost:3333
```

---

# Executando o Frontend

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar `.env`

```env
VITE_BACKEND_URL=http://localhost:3333
VITE_FRONTEND_URL=http://localhost:5173
```

## 3. Rodar frontend

```bash
npm run dev
```

Aplicação padrão:

```txt
http://localhost:5173
```

---

# Endpoints da API

## Criar link

```http
POST /links
```

Body:

```json
{
  "originalUrl": "https://google.com",
  "shortUrl": "google"
}
```

---

## Listar links

```http
GET /links
```

---

## Redirect

```http
GET /links/:shortUrl
```

---

## Remover link

```http
DELETE /links/:shortUrl
```

---

## Exportar CSV

```http
GET /links/export
```

---

# Regras de Negócio

- `shortUrl` deve ser único
- `shortUrl` deve ser minúsculo
- `shortUrl` não pode conter espaços
- `accessCount` é controlado automaticamente pelo backend
- frontend não replica regras complexas da API

---

# Responsividade

O frontend foi desenvolvido seguindo abordagem mobile-first:

- Desktop com formulário e listagem lado a lado
- Mobile com cards empilhados
- Layout responsivo baseado no Figma

---

# UX Implementada

- Toasts de sucesso e erro
- Loading states
- Empty states
- Bloqueio de ações concorrentes
- Modal de confirmação de exclusão
- Feedback visual de validação
- Atualização automática do accessCount

---

# Build

## Backend

```bash
npm run build
```

## Frontend

```bash
npm run build
```

---

# Observações

- O frontend utiliza `VITE_BACKEND_URL` para integração com a API.
- O frontend utiliza `VITE_FRONTEND_URL` para montagem e cópia dos links encurtados.
- A exportação CSV depende da configuração correta do Cloudflare R2.
- O projeto foi desenvolvido preservando a estrutura incremental do código original.

---

## CI / Validação Automatizada

O projeto possui workflow de CI utilizando GitHub Actions para validação automática de:

### Backend
- Instalação de dependências
- Migrations do banco
- Testes automatizados
- Build da aplicação

### Frontend
- Instalação de dependências
- Lint
- Build da aplicação

O workflow é executado automaticamente em:
- push na branch `main`
- pull requests para `main`

---

# Licença

Projeto desenvolvido como avaliação do módulo Fundamentos Técnicos e Estratégicos da Pós-Graduação Full Stack.
