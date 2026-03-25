import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import feedbackRoutes from './routes/feedback.routes';
import aiRoutes from './routes/ai.routes';
import { createFeedbackLimiter } from './middleware/rateLimit';
import { openApiSpec } from './openapi';

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
// Configure CORS from environment variable
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsOptions = {
  origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(o => o.trim()),
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Security: Trust proxy for accurate IP behind reverse proxy
app.set('trust proxy', 1);

// Scalar API Documentation
app.use('/docs', apiReference({
  spec: {
    content: openApiSpec,
  },
  theme: 'kepler',
  layout: 'classic',
  showSidebar: true,
  hideDownloadButton: false,
  hideTestRequestButton: false,
  defaultHttpClient: {
    targetKey: 'javascript',
    clientKey: 'fetch',
  },
  metaData: {
    title: 'Feedback Widget API Documentation',
    description: 'AI-powered feedback widget API documentation',
  },
}));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: {
      ai: true,
      i18n: true,
      analytics: true,
    },
  });
});

// Routes with rate limiting
// Only apply feedback rate limiter to POST requests (creating feedback)
app.use('/feedbacks', (req, res, next) => {
  if (req.method === 'POST') {
    return createFeedbackLimiter(req, res, next);
  }
  next();
}, feedbackRoutes);

// AI routes - mounted at base /ai path
app.use('/ai', aiRoutes);

// Note: Rate limiting for AI analysis endpoints is handled in ai.routes.ts per-route

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API available at http://localhost:${PORT}`);
  console.log(` API Docs at http://localhost:${PORT}/docs`);
  console.log(` Health check at http://localhost:${PORT}/health`);
  console.log(` AI endpoints at http://localhost:${PORT}/ai`);
});
