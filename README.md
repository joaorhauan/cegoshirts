# 🖤 Cego Shirts

> Vitrine digital minimalista para venda de camisas via WhatsApp — com painel admin web e app Android.

![Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Stack](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Stack](https://img.shields.io/badge/Prisma-MySQL-blue?style=flat-square&logo=prisma)
![Stack](https://img.shields.io/badge/React_Native-Expo-purple?style=flat-square&logo=expo)

---

## 📖 Sobre o projeto

A **Cego Shirts** é uma loja de camisas onde a compra é feita diretamente pelo WhatsApp — sem carrinho, sem checkout, sem complicação. O cliente vê as peças, clica em "Comprar" e já cai numa conversa com a mensagem pré-formatada.

O projeto é composto por três partes:

- **Vitrine pública** — onde os clientes navegam pelas camisas disponíveis
- **Painel admin web** — onde o dono gerencia o catálogo e acompanha cliques
- **App Android** — painel admin na palma da mão

---

## ✨ Funcionalidades

### Vitrine pública
- Grade de camisas com filtro por disponibilidade
- Página de detalhe com foto, descrição e preço
- Botão de compra que abre o WhatsApp com mensagem pré-formatada
- Badge de "Esgotada" para produtos indisponíveis
- Design minimalista preto e branco, responsivo

### Painel admin (web + Android)
- Login com autenticação JWT
- Dashboard com lista de camisas e total de cliques em cada uma
- Cadastro de novas camisas com upload de imagem
- Edição de nome, descrição, preço e status
- Marcar camisa como esgotada ou deletar
- Sessão persistente no app Android

---

## 🗂️ Estrutura do projeto

```
cegoshirts/
├── backend/        # API REST — Node.js + Express + Prisma
├── frontend/       # Vitrine + painel admin — Next.js 14
└── mobile/         # App Android — React Native + Expo
```

---

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Node.js + Express |
| ORM | Prisma 6 |
| Banco de dados | MySQL |
| Imagens | Cloudinary |
| Autenticação | JWT + bcrypt |
| Mobile | React Native + Expo + Expo Router |
| Deploy frontend | Vercel |
| Deploy backend | Railway |
| Build Android | EAS Build |

---

## 🚀 Rodando localmente

### Pré-requisitos
- Node.js 18+
- MySQL rodando localmente
- Conta no Cloudinary (gratuita)

### Backend

```bash
cd backend
npm install
```

Cria o banco no MySQL:
```sql
CREATE DATABASE cegoshirts;
```

Configura o `.env`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/cegoshirts"
JWT_SECRET="sua_chave_secreta"
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
ADMIN_EMAIL="admin@cegoshirts.com"
ADMIN_PASSWORD="suasenha"
PORT=3001
```

Roda as migrations e cria o admin:
```bash
npx prisma migrate dev --name init
node scripts/criarAdmin.js
```

Sobe o servidor:
```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
```

Configura o `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WHATSAPP_NUMERO=5584999999999
```

Sobe o servidor:
```bash
npm run dev
```

Acessa em `http://localhost:3000`
Painel admin em `http://localhost:3000/admin/login`

---

### Mobile

```bash
cd mobile
npm install --legacy-peer-deps
```

Configura o `.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3001/api
```

> ⚠️ Troca `192.168.x.x` pelo IP local da sua máquina. O celular e o computador precisam estar na mesma rede Wi-Fi.

Roda o app:
```bash
npx expo start
```

---

## 🌐 Deploy

### Backend — Railway
1. Cria um projeto no [Railway](https://railway.app)
2. Adiciona o plugin MySQL
3. Faz deploy do serviço backend apontando para a pasta `/backend`
4. Configura as variáveis de ambiente
5. Roda as migrations: `railway run npx prisma migrate deploy`
6. Cria o admin: `railway run node scripts/criarAdmin.js`

### Frontend — Vercel
1. Conecta o repositório no [Vercel](https://vercel.com)
2. Define o **Root Directory** como `frontend`
3. Configura as variáveis de ambiente com a URL do Railway

### App Android — EAS Build
```bash
cd mobile
eas build -p android --profile preview
```

O EAS gera o APK na nuvem e disponibiliza o link para download.

---

## 📁 Variáveis de ambiente

### Backend `.env`
| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string do MySQL |
| `JWT_SECRET` | Chave secreta para assinar tokens |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary |
| `CLOUDINARY_API_KEY` | Chave da API do Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret da API do Cloudinary |
| `ADMIN_EMAIL` | Email do administrador |
| `ADMIN_PASSWORD` | Senha do administrador |

### Frontend `.env.local`
| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API |
| `NEXT_PUBLIC_WHATSAPP_NUMERO` | Número do WhatsApp com DDI e DDD |

### Mobile `.env`
| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_URL` | URL base da API |

---

## 🗃️ Banco de dados

```prisma
model Shirt {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  imageUrl    String
  soldout     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  clicks      Click[]
}

model Click {
  id       Int      @id @default(autoincrement())
  shirtId  Int
  createdAt DateTime @default(now())
  shirt    Shirt    @relation(fields: [shirtId], references: [id], onDelete: Cascade)
}

model Admin {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
```

---

## 🔒 Autenticação

As rotas do painel admin são protegidas por JWT. O token é gerado no login, salvo em cookie (web) ou AsyncStorage (mobile), e enviado em todas as requisições no header `Authorization: Bearer <token>`.

No Next.js, o middleware intercepta qualquer acesso a `/admin/*` e redireciona para o login caso não haja token válido.

---

## 📱 Fluxo de compra

```
Cliente acessa a vitrine
        ↓
Navega pelas camisas disponíveis
        ↓
Clique é registrado no banco
        ↓
Cliente clica em "Comprar pelo WhatsApp"
        ↓
WhatsApp abre com mensagem pré-formatada:
"Olá! Tenho interesse na camisa *Nome* (ref: #ID) por R$ XX,XX"
        ↓
Admin responde e fecha a venda
```

---

## 👨‍💻 Autor

Desenvolvido por **Rhauan** — estudante de Tecnologia da Informação na UFRN/IMD.

---

*Feito com 🖤 em Natal, RN*