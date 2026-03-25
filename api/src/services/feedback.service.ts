import { prisma } from '../utils/prisma';
import { sendFeedbackEmail } from '../utils/mail';

interface CreateFeedbackDTO {
  type: 'BUG' | 'IDEA' | 'OTHER' | 'HELP' | 'PRAISE' | 'QUESTION';
  comment: string;
  screenshot?: string | null;
  aiAnalyzed?: boolean;
  aiSuggestedType?: string;
  aiConfidence?: number;
  aiPriority?: string;
  aiSentiment?: string;
  aiSummary?: string;
  aiCategory?: string;
  aiActionItems?: string[];
  aiLanguage?: string;
  aiUILanguage?: string;
  aiTranslated?: string;
  aiResponse?: string;
  aiTranslatedResponse?: string;
  aiScreenshotDesc?: string;
  duplicateOfId?: string | null;
  similarityScore?: number;
  team?: string;
  assignedTo?: string;
}

interface UpdateFeedbackDTO {
  type?: string;
  status?: string;
  statusNote?: string;
  assignedTo?: string;
  team?: string;
  aiResponse?: string;
}

export class FeedbackService {
  async create(data: CreateFeedbackDTO) {
    // Validate duplicateOfId exists if provided
    let duplicateOfId = data.duplicateOfId;
    if (duplicateOfId) {
      const existing = await prisma.feedback.findUnique({
        where: { id: duplicateOfId },
      });
      if (!existing) {
        console.warn(`duplicateOfId ${duplicateOfId} not found, setting to null`);
        duplicateOfId = null;
      }
    }

    // Save feedback to database with all AI fields
    const feedback = await prisma.feedback.create({
      data: {
        type: data.type,
        comment: data.comment,
        screenshot: data.screenshot || null,
        aiAnalyzed: data.aiAnalyzed || false,
        aiSuggestedType: data.aiSuggestedType,
        aiConfidence: data.aiConfidence,
        aiPriority: data.aiPriority,
        aiSentiment: data.aiSentiment,
        aiSummary: data.aiSummary,
        aiCategory: data.aiCategory,
        aiActionItems: data.aiActionItems || [],
        aiLanguage: data.aiLanguage,
        aiUILanguage: data.aiUILanguage,
        aiTranslated: data.aiTranslated,
        aiResponse: data.aiResponse,
        aiTranslatedResponse: data.aiTranslatedResponse,
        aiScreenshotDesc: data.aiScreenshotDesc,
        duplicateOfId,
        similarityScore: data.similarityScore,
        team: data.team,
        assignedTo: data.assignedTo,
      },
    });

    // Send email notification (if not a duplicate)
    if (!data.duplicateOfId) {
      try {
        await sendFeedbackEmail({
          type: data.type,
          comment: data.comment,
          screenshot: data.screenshot,
        });
      } catch (error) {
        console.error('Error sending email:', error);
        // Don't fail the request if email fails
      }
    }

    return feedback;
  }

  async list() {
    return prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        duplicateOf: {
          select: {
            id: true,
            comment: true,
            type: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.feedback.findUnique({
      where: { id },
      include: {
        duplicateOf: {
          select: {
            id: true,
            comment: true,
            type: true,
          },
        },
        duplicates: {
          select: {
            id: true,
            comment: true,
            type: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateFeedbackDTO) {
    return prisma.feedback.update({
      where: { id },
      data,
    });
  }

  async getByTeam(team: string) {
    return prisma.feedback.findMany({
      where: { team },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByStatus(status: string) {
    return prisma.feedback.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByPriority(priority: string) {
    return prisma.feedback.findMany({
      where: { aiPriority: priority },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [
      total,
      byType,
      byPriority,
      bySentiment,
      byStatus,
      byTeam,
    ] = await Promise.all([
      prisma.feedback.count(),
      prisma.feedback.groupBy({ by: ['type'], _count: { type: true } }),
      prisma.feedback.groupBy({ by: ['aiPriority'], _count: { aiPriority: true } }),
      prisma.feedback.groupBy({ by: ['aiSentiment'], _count: { aiSentiment: true } }),
      prisma.feedback.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.feedback.groupBy({ by: ['team'], _count: { team: true } }),
    ]);

    // Calculate simplified stats for mobile app
    const statusCounts = byStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const pending = (statusCounts['PENDING'] || 0) + (statusCounts['IN_PROGRESS'] || 0);
    const resolved = statusCounts['RESOLVED'] || 0;
    const rejected = statusCounts['REJECTED'] || 0;

    return {
      total,
      pending,
      resolved,
      rejected,
      byType,
      byPriority,
      bySentiment,
      byStatus,
      byTeam,
    };
  }
}
