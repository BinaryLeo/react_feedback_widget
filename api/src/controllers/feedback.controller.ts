import { Request, Response } from 'express';
import { z } from 'zod';
import { FeedbackService } from '../services/feedback.service';
import { aiService } from '../ai/service';

const createFeedbackSchema = z.object({
  type: z.enum(['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION']),
  comment: z.string().min(1).max(1000),
  screenshot: z.string().optional().nullable(),
  skipAI: z.boolean().optional(), // Allow skipping AI analysis
  uiLanguage: z.enum(['en', 'es', 'pt-BR', 'zh']).optional(), // UI language for translation
});

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createFeedbackSchema.parse(req.body);
      
      // AI Analysis (if enabled and not skipped)
      let aiAnalysis = null;
      let duplicateCheck = null;
      let routing = null;
      
      if (!validatedData.skipAI) {
        try {
          // Run AI analysis
          aiAnalysis = await aiService.analyzeFeedback(
            validatedData.comment,
            validatedData.type,
            validatedData.screenshot || null,
            validatedData.uiLanguage
          );

          // Check for duplicates
          if (aiAnalysis) {
            duplicateCheck = await aiService.checkDuplicates(validatedData.comment);
            
            // Determine routing
            routing = await aiService.determineTeam(
              aiAnalysis.category,
              aiAnalysis.priority
            );
          }
        } catch (aiError) {
          console.error('AI analysis error:', aiError);
          // Continue without AI analysis - don't fail the request
        }
      }

      // Check for type mismatch and provide suggestion
      let typeSuggestion = null;
      if (aiAnalysis?.typeValidation && !aiAnalysis.typeValidation.isCorrect) {
        typeSuggestion = {
          currentType: validatedData.type,
          suggestedType: aiAnalysis.typeValidation.suggestedType,
          reason: aiAnalysis.typeValidation.reason,
          confidence: aiAnalysis.confidence,
        };
      }

      // Create feedback with AI data
      const feedback = await this.feedbackService.create({
        type: validatedData.type,
        comment: validatedData.comment,
        screenshot: validatedData.screenshot,
        aiAnalyzed: !!aiAnalysis,
        aiSuggestedType: aiAnalysis?.suggestedType,
        aiConfidence: aiAnalysis?.confidence,
        aiPriority: aiAnalysis?.priority,
        aiSentiment: aiAnalysis?.sentiment,
        aiSummary: aiAnalysis?.summary,
        aiCategory: aiAnalysis?.category,
        aiActionItems: aiAnalysis?.actionItems || [],
        aiLanguage: aiAnalysis?.language,
        aiUILanguage: aiAnalysis?.uiLanguage,
        aiTranslated: aiAnalysis?.translatedText,
        aiResponse: aiAnalysis?.suggestedResponse,
        aiTranslatedResponse: aiAnalysis?.translatedResponse,
        aiScreenshotDesc: aiAnalysis?.screenshotAnalysis,
        duplicateOfId: duplicateCheck?.isDuplicate ? duplicateCheck.originalId : null,
        similarityScore: duplicateCheck?.similarityScore,
        team: routing?.team,
        assignedTo: routing?.assignee,
      });

      // Build response
      const response: any = {
        success: true,
        data: feedback,
      };

      // Add AI insights if available
      if (aiAnalysis) {
        response.ai = {
          analyzed: true,
          suggestedType: aiAnalysis.suggestedType,
          confidence: aiAnalysis.confidence,
          priority: aiAnalysis.priority,
          sentiment: aiAnalysis.sentiment,
          category: aiAnalysis.category,
          summary: aiAnalysis.summary,
          actionItems: aiAnalysis.actionItems,
          language: aiAnalysis.language,
          uiLanguage: aiAnalysis.uiLanguage,
          suggestedResponse: aiAnalysis.suggestedResponse,
          translatedResponse: aiAnalysis.translatedResponse,
          typeSuggestion,
          isDuplicate: duplicateCheck?.isDuplicate,
          duplicateOf: duplicateCheck?.originalId,
          similarFeedbacks: duplicateCheck?.similarFeedbacks,
          team: routing?.team,
        };
      }

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
        return;
      }

      console.error('Error creating feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  index = async (_req: Request, res: Response): Promise<void> => {
    try {
      const feedbacks = await this.feedbackService.list();
      res.json({
        success: true,
        data: feedbacks,
      });
    } catch (error) {
      console.error('Error listing feedbacks:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  show = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const feedback = await this.feedbackService.findById(id);

      if (!feedback) {
        res.status(404).json({
          success: false,
          error: 'Feedback not found',
        });
        return;
      }

      res.json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      console.error('Error finding feedback:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  // Get AI-suggested response for a feedback
  getAIResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const feedback = await this.feedbackService.findById(id);

      if (!feedback) {
        res.status(404).json({ success: false, error: 'Feedback not found' });
        return;
      }

      // Return existing AI response or generate new one
      if (feedback.aiResponse) {
        res.json({
          success: true,
          data: { response: feedback.aiResponse },
        });
        return;
      }

      // Generate new response if AI is enabled
      const analysis = await aiService.analyzeFeedback(
        feedback.comment,
        feedback.type as any,
        feedback.screenshot,
        undefined
      );

      if (analysis?.suggestedResponse) {
        // Save the response
        await this.feedbackService.update(feedback.id, {
          aiResponse: analysis.suggestedResponse,
        });

        res.json({
          success: true,
          data: { response: analysis.suggestedResponse },
        });
      } else {
        res.json({
          success: true,
          data: { response: null },
        });
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

  rate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const rateSchema = z.object({
        rating: z.enum(['POSITIVE', 'NEGATIVE']),
        ratingNote: z.string().max(500).optional().nullable(),
      });
      const { rating, ratingNote } = rateSchema.parse(req.body);
      const feedback = await this.feedbackService.findById(id);
      if (!feedback) {
        res.status(404).json({ success: false, error: 'Feedback not found' });
        return;
      }
      const updated = await this.feedbackService.update(id, {
        rating,
        ratingNote: ratingNote ?? null,
      } as any);
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
        return;
      }
      console.error('Error rating feedback:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

  // Update feedback status (PATCH /feedbacks/:id/status)
  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const statusSchema = z.object({
        status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']),
        note: z.string().max(500).optional().nullable(),
      });
      const { status, note } = statusSchema.parse(req.body);
      
      const feedback = await this.feedbackService.findById(id);
      if (!feedback) {
        res.status(404).json({ success: false, error: 'Feedback not found' });
        return;
      }
      
      const updated = await this.feedbackService.update(id, {
        status,
        statusNote: note ?? null,
      } as any);
      
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
        return;
      }
      console.error('Error updating feedback status:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

  updateType = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      console.log(`[updateType] Updating feedback ${id} with body:`, req.body);
      
      const typeSchema = z.object({
        type: z.enum(['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION']),
      });
      const { type } = typeSchema.parse(req.body);
      
      const feedback = await this.feedbackService.findById(id);
      if (!feedback) {
        console.log(`[updateType] Feedback ${id} not found`);
        res.status(404).json({ success: false, error: 'Feedback not found' });
        return;
      }
      
      console.log(`[updateType] Found feedback, updating type to ${type}`);
      const updated = await this.feedbackService.update(id, { type } as any);
      console.log(`[updateType] Successfully updated feedback ${id}`);
      
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('[updateType] Validation error:', error.errors);
        res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
        return;
      }
      console.error('[updateType] Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
}
