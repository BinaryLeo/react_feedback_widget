import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { aiService } from '../ai/service';
import { AIConfig } from '../ai/types';

const updateConfigSchema = z.object({
  provider: z.enum(['MOONSHOT', 'ANTHROPIC', 'OPENAI', 'NONE']),
  apiKey: z.string().optional().nullable(),
  baseUrl: z.string().optional().nullable(),
  model: z.string(),
  enabled: z.boolean(),
  businessContext: z.string().optional().nullable(),
  features: z.object({
    autoCategorize: z.boolean(),
    validateType: z.boolean(),
    priorityScoring: z.boolean(),
    sentimentAnalysis: z.boolean(),
    autoResponse: z.boolean(),
    screenshotAnalysis: z.boolean(),
    duplicateDetection: z.boolean(),
    smartRouting: z.boolean(),
    languageDetection: z.boolean(),
  }),
  thresholds: z.object({
    minConfidence: z.number().min(0).max(1),
    duplicateThreshold: z.number().min(0).max(1),
  }),
});

const testAIRequestSchema = z.object({
  message: z.string(),
  type: z.enum(['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION']),
  provider: z.enum(['MOONSHOT', 'ANTHROPIC', 'OPENAI']),
  apiKey: z.string(),
  model: z.string(),
  baseUrl: z.string().optional(),
});

export class AIController {
  // Get AI configuration
  async getConfig(req: Request, res: Response): Promise<void> {
    try {
      const projectId = (req.params.projectId as string) || 'default';
      
      let config = await prisma.aIConfig.findUnique({
        where: { projectId },
      });

      // Return default config if not exists
      if (!config) {
        config = {
          id: 'default',
          projectId,
          provider: 'NONE',
          apiKey: null,
          baseUrl: null,
          model: 'kimi-k1',
          enabled: false,
          autoCategorize: true,
          validateType: true,
          priorityScoring: true,
          sentimentAnalysis: true,
          autoResponse: true,
          screenshotAnalysis: true,
          duplicateDetection: true,
          smartRouting: true,
          languageDetection: true,
          minConfidence: 0.7,
          duplicateThreshold: 0.85,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
      }

      // Don't return the actual API key, just indicate if it exists
      res.json({
        success: true,
        config: {
          ...config!,
          apiKey: config!.apiKey ? '***' : null,
          hasApiKey: !!config!.apiKey,
        },
      });
    } catch (error) {
      console.error('Error getting AI config:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Get full AI configuration with actual API key (for testing)
  async getFullConfig(req: Request, res: Response): Promise<void> {
    try {
      const projectId = (req.params.projectId as string) || 'default';
      
      const config = await prisma.aIConfig.findUnique({
        where: { projectId },
      });

      if (!config) {
        res.status(404).json({ success: false, error: 'Config not found' });
        return;
      }

      // Return config with actual API key
      res.json({
        success: true,
        config: {
          ...config,
          hasApiKey: !!config.apiKey,
        },
      });
    } catch (error) {
      console.error('Error getting full AI config:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // Update AI configuration
  async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const projectId = (req.params.projectId as string) || 'default';
      const validatedData = updateConfigSchema.parse(req.body);

      // Check if config exists
      const existing = await prisma.aIConfig.findUnique({
        where: { projectId },
      });

      let config;
      if (existing) {
        // Update existing - only update apiKey if explicitly provided (not null/undefined)
        const { features, thresholds, ...rest } = validatedData as any;
        const updateData: any = { ...rest, ...features, ...thresholds };
        if (validatedData.apiKey === null || validatedData.apiKey === undefined) {
          // Don't update apiKey if not provided - keep existing
          delete updateData.apiKey;
        }

        config = await prisma.aIConfig.update({
          where: { projectId },
          data: updateData,
        });
      } else {
        // Create new - remove null apiKey for new records
        const { features, thresholds, ...rest } = validatedData as any;
        const createData: any = { projectId, ...rest, ...features, ...thresholds };
        if (createData.apiKey === null) {
          delete createData.apiKey;
        }

        config = await prisma.aIConfig.create({
          data: createData,
        });
      }

      res.json({
        success: true,
        data: {
          ...config,
          apiKey: config.apiKey ? '***' : null,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
        return;
      }
      console.error('Error updating AI config:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Test AI connection
  async testConnection(req: Request, res: Response): Promise<void> {
    try {
      const { provider, apiKey, model, baseUrl } = req.body;

      if (!apiKey) {
        res.status(400).json({ success: false, error: 'API key is required' });
        return;
      }

      // Simple test prompt
      const testMessage = 'Say "AI connection successful" and nothing else.';
      
      let response;
      if (provider === 'MOONSHOT') {
        const url = baseUrl || 'https://api.moonshot.ai/v1';
        const result = await fetch(`${url}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || 'kimi-k2.5',
            messages: [{ role: 'user', content: testMessage }],
            max_tokens: 50,
          }),
        });
        
        if (!result.ok) {
          const error = await result.text();
          throw new Error(error);
        }
        
        const data = await result.json() as any;
        response = data.choices[0]?.message?.content;
      } else if (provider === 'ANTHROPIC') {
        const url = baseUrl || 'https://api.anthropic.com/v1';
        const result = await fetch(`${url}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: model || 'claude-sonnet-4-20250514',
            max_tokens: 50,
            messages: [{ role: 'user', content: testMessage }],
          }),
        });
        
        if (!result.ok) {
          const error = await result.text();
          throw new Error(error);
        }
        
        const data = await result.json() as any;
        response = data.content[0]?.text;
      }

      res.json({
        success: true,
        data: {
          connected: true,
          response: response?.trim(),
        },
      });
    } catch (error) {
      console.error('AI test connection error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect to AI provider',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Test AI analysis with temporary config
  async testAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = testAIRequestSchema.parse(req.body);
      
      const { AIProviderFactory } = await import('../ai/factory');
      
      const tempConfig: AIConfig = {
        provider: validatedData.provider,
        apiKey: validatedData.apiKey,
        baseUrl: validatedData.baseUrl,
        model: validatedData.model,
        enabled: true,
        features: {
          autoCategorize: true,
          validateType: true,
          priorityScoring: true,
          sentimentAnalysis: true,
          autoResponse: true,
          screenshotAnalysis: false,
          duplicateDetection: false,
          smartRouting: false,
          languageDetection: true,
        },
        thresholds: {
          minConfidence: 0.7,
          duplicateThreshold: 0.85,
        },
      };

      const provider = AIProviderFactory.createProvider(tempConfig);
      if (!provider) {
        res.status(400).json({ success: false, error: 'Failed to create AI provider' });
        return;
      }

      const analysis = await provider.analyzeFeedback(
        validatedData.message,
        validatedData.type,
        null,
        undefined
      );

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
        return;
      }
      console.error('AI test analysis error:', error);
      res.status(500).json({
        success: false,
        error: 'AI analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Pre-submission analysis using stored config (no inline apiKey required)
  async analyze(req: Request, res: Response): Promise<void> {
    try {
      const analyzeSchema = z.object({
        message: z.string().min(1).max(1000),
        type: z.enum(['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION']),
        projectId: z.string().optional(),
        provider: z.string().optional(),
        apiKey: z.string().optional(),
        model: z.string().optional(),
      });

      const { message, type, projectId = 'default', provider, apiKey, model } = analyzeSchema.parse(req.body);

      // If provider credentials are provided in request, use them directly
      let config = null;
      if (provider && apiKey) {
        config = {
          provider: provider.toUpperCase() as any,
          apiKey,
          model: model || 'gpt-4o',
          enabled: true,
          businessContext: undefined,
          features: {
            autoCategorize: true,
            validateType: true,
            priorityScoring: true,
            sentimentAnalysis: true,
            autoResponse: true,
            screenshotAnalysis: false,
            duplicateDetection: true,
            smartRouting: true,
            languageDetection: true,
          },
          thresholds: {
            minConfidence: 0.7,
            duplicateThreshold: 0.85,
          },
        };
      }

      const analysis = await aiService.analyzeFeedback(message, type as any, null, undefined, projectId, config);

      if (!analysis) {
        res.json({ success: true, data: null, message: 'AI not enabled' });
        return;
      }

      res.json({ success: true, data: analysis });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
        return;
      }
      console.error('AI analyze error:', error);
      res.status(500).json({ success: false, error: 'Analysis failed' });
    }
  }

  // Get AI status (enabled/disabled)
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const projectId = (req.params.projectId as string) || 'default';
      const enabled = await aiService.isEnabled(projectId);
      
      res.json({
        success: true,
        data: { enabled },
      });
    } catch (error) {
      console.error('Error getting AI status:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}

export const aiController = new AIController();
