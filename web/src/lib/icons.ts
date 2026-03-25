/**
 * Icon mappings for feedback types, priorities, sentiments, etc.
 * Returns Phosphor icon names/props instead of emoji
 */
import {
  Bug,
  Lightbulb,
  Question,
  Heart,
  ChatTeardropText,
  CaretDoubleUp,
  CaretUp,
  Minus,
  CaretDown,
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyAngry,
  SmileyXEyes,
  Warning,
  Shield,
  BookOpen,
  CreditCard,
  PlugsConnected,
  Gauge,
  Layout,
  FileText,
  Rocket,
  PaintBrush,
  Headset,
  ChartPieSlice,
  LockKey,
  Receipt,
  TreeStructure,
  Users,
  type Icon,
} from '@phosphor-icons/react';

// Type icons
export const typeIcons: Record<string, Icon> = {
  BUG: Bug,
  IDEA: Lightbulb,
  HELP: Question,
  PRAISE: Heart,
  QUESTION: ChatTeardropText,
  OTHER: FileText,
};

// Priority icons
export const priorityIcons: Record<string, Icon> = {
  CRITICAL: CaretDoubleUp,
  HIGH: CaretUp,
  MEDIUM: Minus,
  LOW: CaretDown,
};

// Sentiment icons
export const sentimentIcons: Record<string, Icon> = {
  HAPPY: Smiley,
  NEUTRAL: SmileyMeh,
  FRUSTRATED: SmileySad,
  ANGRY: SmileyAngry,
  CONFUSED: SmileyXEyes,
};

// Category icons
export const categoryIcons: Record<string, Icon> = {
  UI_ISSUE: Layout,
  PERFORMANCE: Gauge,
  SECURITY: Shield,
  FEATURE_REQUEST: Rocket,
  BUG_REPORT: Warning,
  DOCUMENTATION: BookOpen,
  BILLING: CreditCard,
  INTEGRATION: PlugsConnected,
  OTHER: FileText,
};

// Team icons
export const teamIcons: Record<string, Icon> = {
  dev: TreeStructure,
  design: PaintBrush,
  support: Headset,
  product: ChartPieSlice,
  security: LockKey,
  finance: Receipt,
};

// Helper to get icon component
export function getTypeIcon(type: string): Icon {
  return typeIcons[type?.toUpperCase()] || FileText;
}

export function getPriorityIcon(priority: string): Icon {
  return priorityIcons[priority?.toUpperCase()] || Minus;
}

export function getSentimentIcon(sentiment: string): Icon {
  return sentimentIcons[sentiment?.toUpperCase()] || SmileyMeh;
}

export function getCategoryIcon(category: string): Icon {
  return categoryIcons[category?.toUpperCase()] || FileText;
}

export function getTeamIcon(team: string): Icon {
  return teamIcons[team?.toLowerCase()] || Users;
}
