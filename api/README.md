# Feedback Widget API

Backend API for the Feedback Widget - built with Express, Prisma, and PostgreSQL. Features optional AI-powered feedback triage, sentiment analysis, and intelligent routing.

## Quick Start

```bash
cd api

# 1. Install dependencies - npm
npm install
# or with bun
bun install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database URL and encryption key

# 3. Run migrations
npx prisma migrate dev
# or with bun
bunx prisma migrate dev

# 4. Start development server
npm run dev
# or with bun
bun run dev
```

Once running, access the interactive API documentation at **http://localhost:3333/docs**

## Project Structure

```
src/
├── ai/                   # AI provider integrations (Anthropic, Moonshot)
├── application/          # Use cases (orchestration)
├── domain/               # Business logic, entities
├── infrastructure/       # DB, HTTP, external services
├── presentation/         # Controllers, routes
├── middleware/           # Auth, validation, rate limiting
├── utils/                # Helper functions
├── container.ts          # DI Container
└── server.ts             # Entry point
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` or `bun run dev` | Start development server with hot reload |
| `npm run build` or `bun run build` | Compile TypeScript |
| `npm start` or `bun start` | Start production server |
| `npm test` or `bun test` | Run tests |
| `npm run db:migrate` or `bun run db:migrate` | Run database migrations |
| `npm run db:studio` or `bun run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed` or `bun run db:seed` | Seed database with sample data |

## Environment Variables

See `.env.example` for all options.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `ENCRYPTION_KEY` - 64-char hex key for encryption

**Optional:**
- `AI_PROVIDER` - MOONSHOT, ANTHROPIC, or NONE
- `AI_API_KEY` - Your AI provider API key
- `SMTP_*` - Email configuration

## API Documentation

Interactive API documentation is available at `/docs` when the server is running.

- **Local**: http://localhost:3333/docs
- **Docker**: http://localhost:3333/docs

The documentation is powered by [Scalar](https://scalar.com) and includes:
- Interactive API explorer
- Request/response examples
- Built-in test client
- OpenAPI schema download

## AI Features (Optional)

The widget works great without AI. When enabled, the API provides:

### Supported Providers

| Provider | Models | Features |
|----------|--------|----------|
| **Moonshot (Kimi)** | kimi-k2.5, kimi-k2, kimi-k2-turbo | All features + vision |
| **Anthropic (Claude)** | claude-sonnet-4, claude-opus-4, claude-haiku-4 | All features + vision |

### Features

| Feature | Description |
|---------|-------------|
| **Smart Categorization** | Auto-suggests feedback type (BUG/IDEA/OTHER) |
| **Type Validation** | Detects mismatches between selected type and content |
| **Priority Scoring** | Assigns CRITICAL/HIGH/MEDIUM/LOW priority |
| **Sentiment Analysis** | Detects user emotion (FRUSTRATED, HAPPY, NEUTRAL, etc) |
| **Duplicate Detection** | Compares with existing feedbacks for similarity |
| **Auto-Response** | Generates helpful AI responses |
| **Screenshot Analysis** | Vision AI analyzes attached screenshots |
| **Smart Routing** | Routes to correct team (dev/design/support/security) |
| **Summary Generation** | Creates concise summaries of long feedback |
| **Action Items** | Extracts actionable tasks from feedback |

### Configuration

```bash
# Disable AI (default)
AI_PROVIDER=NONE

# Enable with Moonshot
AI_PROVIDER=MOONSHOT
AI_API_KEY=your_moonshot_key
AI_MODEL=kimi-k1

# Enable with Anthropic
AI_PROVIDER=ANTHROPIC
AI_API_KEY=your_anthropic_key
AI_MODEL=claude-3-sonnet-20240229
```

AI settings can also be configured per-project via the admin dashboard and are stored encrypted in the database.

### Cost Estimation

Approximate costs per feedback analyzed:

| Provider | Cost per analysis |
|----------|------------------|
| Moonshot | ~$0.001-0.003 |
| Anthropic | ~$0.003-0.015 |

With 1000 feedbacks/month: ~$1-15 depending on provider and features used.

## API Endpoints

### Feedbacks
- `POST /feedbacks` - Create new feedback (AI analyzes if enabled)
- `GET /feedbacks` - List all feedbacks
- `GET /feedbacks/:id` - Get single feedback
- `POST /feedbacks/:id/rate` - Rate feedback response
- `GET /feedbacks/stats` - Get statistics
- `GET /feedbacks/by-team/:team` - Filter by assigned team
- `GET /feedbacks/by-priority/:priority` - Filter by priority

### AI
- `GET /ai/config/:projectId?` - Get AI configuration
- `PUT /ai/config/:projectId?` - Update AI configuration
- `POST /ai/test-connection` - Test AI provider connection
- `POST /ai/test-analysis` - Test AI analysis
- `GET /ai/status/:projectId?` - Check if AI is enabled

### Health
- `GET /health` - API health check

### Response Format with AI

When AI is enabled, the `POST /feedbacks` response includes:

```json
{
  "success": true,
  "data": { "feedback": { ... } },
  "ai": {
    "analyzed": true,
    "suggestedType": "IDEA",
    "confidence": 0.95,
    "priority": "MEDIUM",
    "sentiment": "HAPPY",
    "summary": "User requesting dark mode feature",
    "actionItems": ["Add dark mode to roadmap"],
    "suggestedResponse": "Thanks for the suggestion! We're working on it...",
    "isDuplicate": false,
    "team": "product"
  }
}
```

## Testing

```bash
# Run all tests
npm test
# or with bun
bun test

# Watch mode
npm run test:watch
# or with bun
bun run test:watch
```

## Docker

```bash
# Build image
docker build -t feedback-widget-api .

# Run container
docker run -p 3333:3333 --env-file .env feedback-widget-api
```

## Dependencies

- **Express** - Web framework
- **Prisma** - Database ORM
- **Zod** - Schema validation
- **Nodemailer** - Email sending

## Related

- [Main README](../README.md)
- [Frontend](../web/)
