# 📝 Blog API

API de blog com sistema de autenticação e autorização, desenvolvida com Node.js, Express, TypeScript e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset tipado do JavaScript
- **Prisma** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Passport** - Middleware de autenticação
- **JWT** - Autenticação via tokens

## ✨ Features

- 🔐 Sistema completo de autenticação (signup, signin, validação JWT)
- 📄 CRUD de posts com upload de imagens
- 🏷️ Sistema de tags para posts
- 🔗 Posts relacionados baseados em tags similares
- 📊 Paginação de listagens
- 👤 Área administrativa protegida
- 📝 Sistema de rascunhos e publicação
- 🎯 Slugs únicos para URLs amigáveis

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd blog-api
```

2. Instale as dependências:
```bash
npm i
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais.

4. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```

## ⚙️ Configuração

Certifique-se de configurar as seguintes variáveis no arquivo `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog"
JWT_SECRET="sua-chave-secreta"
PORT=3000
NODE_ENV="development"
```

## 🏃 Como executar

### Modo desenvolvimento:
```bash
tsx watch src/server.ts
```

A API estará disponível em `http://localhost:3000/api`

## 📚 Documentação da API

A documentação completa dos endpoints está disponível no arquivo [`openapi.yaml`](./openapi.yaml) no formato **OpenAPI 3.0.4**.

### 📖 Visualizando a documentação

Você pode visualizar a documentação de forma interativa usando:

**1. Swagger Editor (Online)**
- Acesse: https://editor.swagger.io/
- Copie o conteúdo do arquivo `openapi.yaml`
- Cole no editor para ver a documentação visual

**2. Swagger UI (Local)**
```bash
# acesse diretamente pela rota
- http://localhost:3000/api/docs
```

### Endpoints principais:

#### 🔓 Públicos (Auth)
- `POST /api/auth/signup` - Cadastro de usuário
- `POST /api/auth/signin` - Login
- `POST /api/auth/validate` - Validar token JWT

#### 📖 Posts (Autenticados)
- `GET /api/posts` - Listar posts publicados
- `GET /api/posts/:slug` - Obter post específico
- `GET /api/posts/:slug/related` - Posts relacionados

#### 🔐 Admin (Autenticados)
- `GET /api/admin/posts` - Listar todos os posts (incluindo drafts)
- `GET /api/admin/posts/:slug` - Obter post específico
- `POST /api/admin/posts` - Criar novo post
- `PUT /api/admin/posts/:slug` - Editar post
- `DELETE /api/admin/posts/:slug` - Deletar post

## 🗂️ Estrutura do Banco de Dados

### Post
- `id` - UUID único
- `slug` - URL amigável
- `status` - PUBLISHED | DRAFT
- `title` - Título do post
- `body` - Conteúdo
- `cover` - Imagem de capa
- `tags` - Array de tags
- `authorId` - Referência ao usuário
- `createdAt` / `updatedAt` - Timestamps

### User
- `id` - UUID único
- `name` - Nome do usuário
- `email` - Email único
- `password` - Senha criptografada
- `status` - Ativo/Inativo

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm i

# Rodar em desenvolvimento
tsx watch src/server.ts

# Migrations do Prisma
npx prisma migrate dev

# Visualizar o banco de dados
npx prisma studio

# Gerar Prisma Client
npx prisma generate

# Resetar banco de dados
npx prisma migrate reset
```

## 🔒 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 📦 Upload de Arquivos

A rota de criação e edição de posts (`POST /api/admin/posts` e `PUT /api/admin/posts/:slug`) aceita `multipart/form-data` para upload da imagem de capa.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

Feito com ❤️
