// Domain Entity - Pure business logic, no external dependencies
import type { FeedbackType, Status, Priority, Sentiment, Category, Team } from '../../types';

export interface FeedbackProps {
  id: string;
  type: FeedbackType;
  comment: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  aiAnalyzed: boolean;
  aiSuggestedType?: FeedbackType;
  aiConfidence?: number;
  aiPriority?: Priority;
  aiSentiment?: Sentiment;
  aiCategory?: Category;
  aiSummary?: string;
  aiActionItems?: string[];
  aiLanguage?: string;
  aiUILanguage?: string;
  aiTranslated?: string;
  aiResponse?: string;
  aiTranslatedResponse?: string;
  aiScreenshotDesc?: string;
  duplicateOfId?: string | null;
  similarityScore?: number;
  team?: Team;
  assignedTo?: string;
  rating?: 'POSITIVE' | 'NEGATIVE';
  ratingNote?: string;
  screenshot?: string | null;
}

export class Feedback {
  constructor(private props: FeedbackProps) {}

  // Getters
  get id(): string { return this.props.id; }
  get type(): FeedbackType { return this.props.type; }
  get comment(): string { return this.props.comment; }
  get status(): Status { return this.props.status; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }
  get aiAnalyzed(): boolean { return this.props.aiAnalyzed; }
  get aiSuggestedType(): FeedbackType | undefined { return this.props.aiSuggestedType; }
  get aiConfidence(): number | undefined { return this.props.aiConfidence; }
  get aiPriority(): Priority | undefined { return this.props.aiPriority; }
  get aiSentiment(): Sentiment | undefined { return this.props.aiSentiment; }
  get aiCategory(): Category | undefined { return this.props.aiCategory; }
  get aiSummary(): string | undefined { return this.props.aiSummary; }
  get aiActionItems(): string[] | undefined { return this.props.aiActionItems; }
  get aiLanguage(): string | undefined { return this.props.aiLanguage; }
  get aiUILanguage(): string | undefined { return this.props.aiUILanguage; }
  get aiTranslated(): string | undefined { return this.props.aiTranslated; }
  get aiResponse(): string | undefined { return this.props.aiResponse; }
  get aiTranslatedResponse(): string | undefined { return this.props.aiTranslatedResponse; }
  get aiScreenshotDesc(): string | undefined { return this.props.aiScreenshotDesc; }
  get duplicateOfId(): string | null | undefined { return this.props.duplicateOfId; }
  get similarityScore(): number | undefined { return this.props.similarityScore; }
  get team(): Team | undefined { return this.props.team; }
  get assignedTo(): string | undefined { return this.props.assignedTo; }
  get rating(): 'POSITIVE' | 'NEGATIVE' | undefined { return this.props.rating; }
  get ratingNote(): string | undefined { return this.props.ratingNote; }
  get screenshot(): string | null | undefined { return this.props.screenshot; }

  // Business logic methods
  updateStatus(newStatus: Status): Feedback {
    return new Feedback({
      ...this.props,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  }

  updateType(newType: FeedbackType): Feedback {
    return new Feedback({
      ...this.props,
      type: newType,
      updatedAt: new Date().toISOString(),
    });
  }

  addRating(rating: 'POSITIVE' | 'NEGATIVE', note?: string): Feedback {
    return new Feedback({
      ...this.props,
      rating,
      ratingNote: note,
      updatedAt: new Date().toISOString(),
    });
  }

  // Business rules
  isHighPriority(): boolean {
    return this.props.aiPriority === 'CRITICAL' || this.props.aiPriority === 'HIGH';
  }

  isResolved(): boolean {
    return this.props.status === 'RESOLVED' || this.props.status === 'CLOSED';
  }

  hasRating(): boolean {
    return this.props.rating !== undefined;
  }

  isDuplicate(): boolean {
    return this.props.duplicateOfId !== null && this.props.duplicateOfId !== undefined;
  }

  // Factory method from DTO
  static fromDTO(dto: FeedbackProps): Feedback {
    return new Feedback(dto);
  }

  // Convert to plain object
  toDTO(): FeedbackProps {
    return { ...this.props };
  }
}
