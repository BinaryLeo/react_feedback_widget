import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { aiAnalyzeLimiter } from '../middleware/rateLimit';

const router = Router();

// Get full AI configuration with actual API key (for testing) - MUST be before /config/:projectId
router.get('/config/full', aiController.getFullConfig);
router.get('/config/:projectId/full', aiController.getFullConfig);

// Get AI configuration - support both /config and /config/:projectId (NO rate limit)
router.get('/config', aiController.getConfig);
router.get('/config/:projectId', aiController.getConfig);

// Update AI configuration - support both /config and /config/:projectId (NO rate limit)
router.put('/config', aiController.updateConfig);
router.put('/config/:projectId', aiController.updateConfig);

// Test AI connection (WITH rate limit)
router.post('/test-connection', aiAnalyzeLimiter, aiController.testConnection);

// Test AI analysis (WITH rate limit)
router.post('/test-analysis', aiAnalyzeLimiter, aiController.testAnalysis);

// Real-time pre-submission analysis (WITH rate limit)
router.post('/analyze', aiAnalyzeLimiter, aiController.analyze);

// Get AI status - support both /status and /status/:projectId (NO rate limit)
router.get('/status', aiController.getStatus);
router.get('/status/:projectId', aiController.getStatus);

export default router;
