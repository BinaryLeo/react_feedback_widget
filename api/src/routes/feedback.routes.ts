import { Router } from 'express';
import { FeedbackController } from '../controllers/feedback.controller';

const router = Router();
const feedbackController = new FeedbackController();

// POST /feedbacks - Create a new feedback
router.post('/', feedbackController.create);

// GET /feedbacks - List all feedbacks
router.get('/', feedbackController.index);

// GET /feedbacks/stats - Get feedback statistics
router.get('/stats', async (req, res) => {
  const { FeedbackService } = await import('../services/feedback.service');
  const service = new FeedbackService();
  const stats = await service.getStats();
  res.json({ success: true, data: stats });
});

// GET /feedbacks/by-team/:team - Get feedbacks by team
router.get('/by-team/:team', async (req, res) => {
  const { FeedbackService } = await import('../services/feedback.service');
  const service = new FeedbackService();
  const feedbacks = await service.getByTeam(req.params.team);
  res.json({ success: true, data: feedbacks });
});

// GET /feedbacks/by-status/:status - Get feedbacks by status
router.get('/by-status/:status', async (req, res) => {
  const { FeedbackService } = await import('../services/feedback.service');
  const service = new FeedbackService();
  const feedbacks = await service.getByStatus(req.params.status);
  res.json({ success: true, data: feedbacks });
});

// GET /feedbacks/by-priority/:priority - Get feedbacks by priority
router.get('/by-priority/:priority', async (req, res) => {
  const { FeedbackService } = await import('../services/feedback.service');
  const service = new FeedbackService();
  const feedbacks = await service.getByPriority(req.params.priority);
  res.json({ success: true, data: feedbacks });
});

// GET /feedbacks/:id/ai-response - Get AI suggested response
router.get('/:id/ai-response', feedbackController.getAIResponse);

// PATCH /feedbacks/:id/rate - Rate the AI response
router.patch('/:id/rate', feedbackController.rate);

// PATCH /feedbacks/:id/status - Update feedback status
router.patch('/:id/status', feedbackController.updateStatus);

// PATCH /feedbacks/:id/type - Update feedback type (must be before /:id)
router.patch('/:id/type', feedbackController.updateType);

// GET /feedbacks/:id - Get a specific feedback (keep last)
router.get('/:id', feedbackController.show);

export default router;
