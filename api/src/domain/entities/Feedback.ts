/**
 * Domain Entity: Feedback
 * Rich model with business rules and validation
 */

export type FeedbackType = 'BUG' | 'IDEA' | 'OTHER' | 'HELP' | 'PRAISE' | 'QUESTION';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
export type Sentiment = 'FRUSTRATED' | 'HAPPY' | 'NEUTRAL' | 'ANGRY' | 'CONFUSED';

export interface AIAnalysis {
  suggestedType: FeedbackType;
  confidence: number;
  priority: Priority;
  sentiment: Sentiment;
  category: string;
  summary?: string;
  actionItems: string[];
  language?: string;
  uiLanguage?: string;
  translatedText?: string;
  suggestedResponse?: string;
  translatedResponse?: string;
  isRelevant: boolean;
}

export interface CreateFeedbackData {
  type: FeedbackType;
  comment: string;
  screenshot?: string | null;
  metadata?: {
    url?: string;
    userAgent?: string;
    timestamp?: number;
  };
}

export class Feedback {
  public readonly id: string;
  public readonly type: FeedbackType;
  public readonly comment: string;
  public readonly screenshot: string | null;
  public readonly createdAt: Date;
  public readonly metadata?: CreateFeedbackData['metadata'];
  
  // Mutable fields
  private _status: Status;
  private _aiAnalysis: AIAnalysis | null;
  private _team: string | null;
  private _assignedTo: string | null;
  private _rating: 'POSITIVE' | 'NEGATIVE' | null;
  private _ratingNote: string | null;
  private _duplicateOfId: string | null;

  private constructor(data: {
    id: string;
    type: FeedbackType;
    comment: string;
    screenshot?: string | null;
    status: Status;
    aiAnalysis?: AIAnalysis | null;
    createdAt?: Date;
    team?: string | null;
    assignedTo?: string | null;
    rating?: 'POSITIVE' | 'NEGATIVE' | null;
    ratingNote?: string | null;
    duplicateOfId?: string | null;
    metadata?: CreateFeedbackData['metadata'];
  }) {
    this.id = data.id;
    this.type = data.type;
    this.comment = data.comment;
    this.screenshot = data.screenshot || null;
    this._status = data.status;
    this._aiAnalysis = data.aiAnalysis || null;
    this.createdAt = data.createdAt || new Date();
    this._team = data.team || null;
    this._assignedTo = data.assignedTo || null;
    this._rating = data.rating || null;
    this._ratingNote = data.ratingNote || null;
    this._duplicateOfId = data.duplicateOfId || null;
    this.metadata = data.metadata;
  }

  // Factory method with validation
  static create(data: CreateFeedbackData & { id?: string }): Feedback {
    // Validation
    if (!data.comment || data.comment.trim().length < 3) {
      throw new Error('Comment must be at least 3 characters');
    }
    
    if (data.comment.length > 5000) {
      throw new Error('Comment must be at most 5000 characters');
    }

    if (data.screenshot) {
      // Check base64 size (rough estimate: 4 chars = 3 bytes)
      const sizeInBytes = (data.screenshot.length * 3) / 4;
      if (sizeInBytes > 5 * 1024 * 1024) { // 5MB
        throw new Error('Screenshot too large (max 5MB)');
      }
    }

    return new Feedback({
      id: data.id || crypto.randomUUID(),
      type: data.type,
      comment: data.comment.trim(),
      screenshot: data.screenshot,
      status: 'PENDING',
      metadata: data.metadata,
    });
  }

  // Business methods
  analyze(aiResult: AIAnalysis): void {
    this._aiAnalysis = aiResult;
  }

  assignTo(team: string, assignee?: string): void {
    this._team = team;
    this._assignedTo = assignee || null;
    this._status = 'IN_PROGRESS';
  }

  rate(rating: 'POSITIVE' | 'NEGATIVE', note?: string): void {
    this._rating = rating;
    this._ratingNote = note || null;
  }

  markAsDuplicate(originalId: string): void {
    this._duplicateOfId = originalId;
  }

  resolve(): void {
    this._status = 'RESOLVED';
  }

  close(): void {
    this._status = 'CLOSED';
  }

  reject(): void {
    this._status = 'REJECTED';
  }

  reopen(): void {
    if (this._status === 'CLOSED' || this._status === 'REJECTED') {
      this._status = 'PENDING';
    }
  }

  // Getters
  get status(): Status { return this._status; }
  get aiAnalysis(): AIAnalysis | null { return this._aiAnalysis; }
  get team(): string | null { return this._team; }
  get assignedTo(): string | null { return this._assignedTo; }
  get rating(): 'POSITIVE' | 'NEGATIVE' | null { return this._rating; }
  get ratingNote(): string | null { return this._ratingNote; }
  get duplicateOfId(): string | null { return this._duplicateOfId; }

  // Business logic queries
  isHighPriority(): boolean {
    return this._aiAnalysis?.priority === 'CRITICAL' || 
           this._aiAnalysis?.priority === 'HIGH';
  }

  isResolved(): boolean {
    return this._status === 'RESOLVED' || this._status === 'CLOSED';
  }

  isDuplicate(): boolean {
    return this._duplicateOfId !== null;
  }

  isAIAnalyzed(): boolean {
    return this._aiAnalysis !== null;
  }

  getAgeInDays(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // For serialization
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      comment: this.comment,
      screenshot: this.screenshot,
      status: this._status,
      aiAnalysis: this._aiAnalysis,
      team: this._team,
      assignedTo: this._assignedTo,
      rating: this._rating,
      ratingNote: this._ratingNote,
      duplicateOfId: this._duplicateOfId,
      createdAt: this.createdAt,
      metadata: this.metadata,
    };
  }

  // Reconstruct from database
  static fromDatabase(data: any): Feedback {
    return new Feedback({
      id: data.id,
      type: data.type,
      comment: data.comment,
      screenshot: data.screenshot,
      status: data.status,
      aiAnalysis: data.aiAnalyzed ? {
        suggestedType: data.aiSuggestedType,
        confidence: data.aiConfidence,
        priority: data.aiPriority,
        sentiment: data.aiSentiment,
        category: data.aiCategory,
        summary: data.aiSummary,
        actionItems: data.aiActionItems || [],
        language: data.aiLanguage,
        suggestedResponse: data.aiResponse,
        isRelevant: true, // Default for existing data
      } : null,
      createdAt: new Date(data.createdAt),
      team: data.team,
      assignedTo: data.assignedTo,
      rating: data.rating,
      ratingNote: data.ratingNote,
      duplicateOfId: data.duplicateOfId,
      metadata: data.metadata,
    });
  }
}
