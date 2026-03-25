# Feedback Widget

AI-powered feedback widget with intelligent triage, drag & drop positioning, and multi-language support.

![Feedback Widget Promo](assets/promo.png)

## Features

- **AI Triage** - Auto-categorization, priority & sentiment analysis
- **Duplicate Detection** - AI-powered detection of similar feedbacks
- **Vision AI** - Analyzes attached screenshots
- **Auto-Response** - Generates helpful AI responses
- **Smart Routing** - Auto-assigns to teams (dev/design/support)
- **i18n** - Multi-language support (EN, ES, PT-BR, ZH)
- **Drag & Drop** - Reposition widget anywhere on screen
- **Security** - Rate limiting, encryption, input validation

## Demo

### Drag and Drop Widget

<video src="assets/drag-zone.mov" width="600" controls></video>

The widget can be dragged and repositioned anywhere on the screen for optimal user experience.

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

### Option 1: Docker (Recommended)

```bash
# 1. Clone
git clone https://github.com/yourusername/react_feedback_widget.git
cd react_feedback_widget

# 2. Start backend (PostgreSQL + API)
./start.sh

# 3. Start frontend (new terminal)
cd web && npm install && npm run dev

# Access the application:
# - Frontend: http://localhost:4321
# - API Docs: http://localhost:3333/docs
```

### Option 2: Manual Setup

```bash
# 1. Clone
git clone https://github.com/yourusername/react_feedback_widget.git
cd react_feedback_widget

# 2. Start PostgreSQL
docker run -d --name feedback-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=feedback_widget \
  -p 5432:5432 postgres:16-alpine

# 3. Setup & start backend
cd api
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

# 4. Setup & start frontend (new terminal)
cd web
cp .env.example .env
npm install
npm run dev

# Open http://localhost:4321
```

## AI Setup (Optional)

The widget works great without AI. To enable:

1. Get API key from [Anthropic](https://console.anthropic.com) or [Moonshot](https://platform.moonshot.ai)
2. Configure in admin dashboard or set in `api/.env`:

```env
AI_PROVIDER=ANTHROPIC
AI_API_KEY=sk-your-key
AI_MODEL=claude-sonnet-4-20250514
```

See [api/README.md#ai-features-optional](api/README.md#-ai-features-optional) for detailed AI configuration and features.

## Project Structure

```
├── api/              # Backend (Express + Prisma)
│   ├── src/
│   │   ├── domain/   # Business logic
│   │   ├── application/  # Use cases
│   │   ├── infrastructure/  # DB, AI, security
│   │   └── presentation/    # Controllers
│   └── prisma/       # Database schema
│
├── web/              # Frontend (Astro + React)
│   ├── src/
│   │   ├── components/  # Widget, AI, Admin
│   │   ├── hooks/       # Reusable logic
│   │   └── lib/         # Crypto, i18n, store
│   └── public/
│
├── mobile/           # Mobile app (React Native + Expo)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom hooks
│   │   ├── screens/     # App screens
│   │   └── services/    # API clients
│   └── App.tsx
│
└── docs/             # Documentation
```

See [web/README.md](web/README.md) for web frontend architecture details.  
See [mobile/README.md](mobile/README.md) for mobile app documentation.

## API Endpoints

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/health`          | Health check     |
| POST   | `/feedbacks`       | Create feedback  |
| GET    | `/feedbacks`       | List feedbacks   |
| GET    | `/feedbacks/stats` | Statistics       |
| POST   | `/ai/analyze`      | Analyze text     |
| GET    | `/ai/config`       | Get AI config    |
| PUT    | `/ai/config`       | Update AI config |

## API Documentation

Interactive API documentation is automatically available when the backend is running:

- **Development**: http://localhost:3333/docs
- **Production**: `https://your-domain.com/docs`

Powered by [Scalar](https://scalar.com) with features:

- Interactive API explorer
- Request/response examples
- Built-in test client
- OpenAPI schema download

## Tech Stack

- **Backend**: Node.js 20+, Express 5, PostgreSQL 16, Prisma 7
- **Frontend**: Astro 5, React 19, Tailwind CSS 4
- **AI**: Anthropic Claude, Moonshot Kimi
- **Security**: AES-256-GCM, Rate limiting, Zod validation

## Docker Commands

```bash
./start.sh up         # Start all services
./start.sh down       # Stop all services
./start.sh logs       # View logs
./start.sh reset      # Reset database (WARNING: deletes data!)
./start.sh migrate    # Run migrations
./start.sh studio     # Open Prisma Studio (DB GUI)
```

## Production Deployment

### Option 1: Self-Hosted with Docker (Recommended)

For VPS, EC2, DigitalOcean, etc.

```bash
# 1. Setup
./start.sh

# 2. Configure environment
cp .env.production.example .env.production
nano .env.production

# 3. Deploy
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

**Required changes in `.env.production`:**

```env
POSTGRES_PASSWORD=your-strong-password
DATABASE_URL=postgresql://postgres:your-password@postgres:5432/feedback_widget
CORS_ORIGIN=https://yourdomain.com
```

**Optional - Enable AI:**

```env
AI_PROVIDER=ANTHROPIC
AI_API_KEY=sk-your-key
```

### Option 2: Vercel + Railway

#### Deploy Backend to Railway

```bash
cd api
railway login
railway init
railway add --database postgres
railway up
```

Set environment variables in Railway dashboard:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3333
CORS_ORIGIN=https://your-frontend.vercel.app
```

#### Deploy Frontend to Vercel

```bash
cd web
vercel
```

Set environment variable:

```env
PUBLIC_API_URL=https://your-api.up.railway.app
```

### Updates

```bash
# Docker Self-Hosted
git pull
docker-compose -f docker-compose.prod.yml up -d

# Railway
cd api && git pull && railway up

# Vercel
cd web && git pull && vercel --prod
```

### Troubleshooting

| Issue                      | Solution                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| CORS Errors                | Add your frontend domain to API CORS settings                                                                                    |
| Database Connection Failed | Check `DATABASE_URL` format, verify database is running with `docker-compose ps`, check logs with `docker-compose logs postgres` |
| AI Not Working             | Verify `AI_PROVIDER` and `AI_API_KEY`, test connection in admin dashboard                                                        |

## Environment Variables

### Backend (`api/.env`)

| Variable         | Required | Description                    |
| ---------------- | -------- | ------------------------------ |
| `DATABASE_URL`   | Yes      | PostgreSQL connection string   |
| `ENCRYPTION_KEY` | Yes      | 64-char hex key for encryption |
| `PORT`           | No       | Default: 3333                  |
| `CORS_ORIGIN`    | No       | Allowed frontend domains       |
| `AI_PROVIDER`    | No       | ANTHROPIC, MOONSHOT, or NONE   |
| `AI_API_KEY`     | No       | Your AI provider API key       |

### Frontend (`web/.env`)

| Variable                  | Required | Description                     |
| ------------------------- | -------- | ------------------------------- |
| `PUBLIC_API_URL`          | Yes      | Backend API URL                 |
| `PUBLIC_DEFAULT_LANGUAGE` | No       | en, es, pt-BR, zh               |
| `PUBLIC_WIDGET_POSITION`  | No       | bottom-right, bottom-left, etc. |
| `PUBLIC_WIDGET_COLOR`     | No       | Brand color (hex without #)     |

## Internationalization

Supported languages: English, Spanish, Portuguese (BR), Chinese

Add translation in `web/src/lib/i18n/locales/`:

```typescript
'widget.new_key': 'Your text',
```

Use in component:

```typescript
import { t } from "../lib/i18n";
const text = t("widget.new_key", language);
```

## Testing

```bash
# Backend tests
cd api && npm test

# Frontend tests
cd web && npm test
```

## Contributing

Thank you for your interest in contributing!

### Getting Started

1. Fork and clone the repository
2. Follow the [Quick Start](#-quick-start) above
3. Create a branch: `git checkout -b feature/your-feature-name`

### Code Style

- **TypeScript**: Strict mode enabled
- **Naming**: PascalCase for components, camelCase for functions
- **No `any` types**: Use proper TypeScript types

### Commits

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
refactor: improve code structure
docs: update documentation
```

### Pull Request Process

1. Ensure tests pass locally
2. Update documentation if needed
3. Link related issues
4. Request review

### Security Guidelines

- Never commit `.env` files
- Sanitize user inputs
- Use parameterized queries

### Internationalization

When adding UI text:

1. Add to all translation files:
   - `web/src/lib/i18n/locales/en.ts`
   - `web/src/lib/i18n/locales/es.ts`
   - `web/src/lib/i18n/locales/pt-BR.ts`
   - `web/src/lib/i18n/locales/zh.ts`

2. Use the translation key:
   ```tsx
   import { t } from "../lib/i18n";
   const text = t("your.key", language);
   ```

## Architecture

We follow Clean Architecture principles with clear dependency direction:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│              (Controllers, Components, Routes)              │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                         │
│              (Use Cases / Application Services)             │
├─────────────────────────────────────────────────────────────┤
│                     DOMAIN LAYER                            │
│      (Entities, Value Objects, Repository Interfaces)       │
├─────────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE LAYER                       │
│    (Database, External APIs, Email, Encryption, AI)         │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Dependencies only point inward. Domain has no external dependencies.

### Key Patterns

- **Repository Pattern**: Decouple domain logic from database implementation
- **Use Cases**: Isolate business operations from HTTP/UI concerns
- **Dependency Injection**: Enable testing and loose coupling
- **Client-Side Encryption**: API keys are encrypted in browser, never touch server

### Security Architecture

| Threat              | Mitigation                                    |
| ------------------- | --------------------------------------------- |
| SQL Injection       | Prisma ORM (parameterized queries)            |
| XSS                 | No dangerous innerHTML, safe components       |
| CSRF                | Stateless API, CORS whitelist                 |
| Rate limiting       | IP-based limiting (memory-based, use Redis in prod) |
| API key exposure    | Client-side encryption, never logged          |
| Screenshot abuse    | 5MB size limit, base64 validation             |

## Documentation

- [API README](api/README.md) - Backend documentation & AI features
- [Web README](web/README.md) - Frontend documentation & Clean Architecture

## License

MIT License - see [LICENSE](LICENSE) file.

---

Built for the open source community
