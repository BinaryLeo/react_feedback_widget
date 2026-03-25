// English translations - Master file
// ALL strings in the application must be defined here

export const en = {
  // ==========================================
  // COMMON / SHARED STRINGS
  // ==========================================
  'common.loading': 'Loading...',
  'common.save': 'Save',
  'common.saving': 'Saving...',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.close': 'Close',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.refresh': 'Refresh',
  'common.copy': 'Copy',
  'common.copied': 'Copied!',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.retry': 'Retry',
  'common.show_more': 'Show more',
  'common.show_less': 'Show less',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.continue': 'Continue',
  'common.done': 'Done',
  'common.test': 'Test',
  'common.testing': 'Testing...',
  'common.configure': 'Configure',
  'common.enabled': 'Enabled',
  'common.disabled': 'Disabled',
  'common.default': 'Default',
  'common.recommended': 'Recommended',
  'common.optional': 'Optional',
  'common.required': 'Required',

  // ==========================================
  // NAVIGATION
  // ==========================================
  'nav.dashboard': 'Dashboard',
  'nav.feedbacks': 'Feedbacks',
  'nav.analytics': 'Analytics',
  'nav.settings': 'Settings',
  'nav.api_docs': 'API Docs',
  'nav.logout': 'Logout',
  'nav.home': 'Home',

  // ==========================================
  // LANGUAGES
  // ==========================================
  'lang.en': 'English',
  'lang.es': 'Spanish',
  'lang.pt-BR': 'Portuguese (Brazil)',
  'lang.zh': 'Chinese',
  'lang.select': 'Select Language',
  'lang.detected': 'Detected language',
  'lang.switch': 'Switch',

  // ==========================================
  // DASHBOARD PAGE
  // ==========================================
  'dashboard.title': 'Feedback Dashboard',
  'dashboard.subtitle': 'AI-Powered Triage',
  'dashboard.total_feedbacks': 'Total Feedbacks',
  'dashboard.new_today': 'New Today',
  'dashboard.avg_response': 'Avg Response Time',
  'dashboard.ai_enabled': 'AI Enabled',
  'dashboard.no_feedbacks': 'No feedbacks found',
  'dashboard.try_adjusting': 'Try adjusting your filters',

  // Stats
  'stats.total': 'Total',
  'stats.by_type': 'By Type',
  'stats.by_priority': 'By Priority',
  'stats.by_sentiment': 'By Sentiment',
  'stats.by_status': 'By Status',
  'stats.by_team': 'By Team',
  'stats.today': 'Today',
  'stats.this_week': 'This Week',
  'stats.this_month': 'This Month',

  // Filters
  'filter.all': 'All Feedbacks',
  'filter.all_types': 'All Types',
  'filter.all_priorities': 'All Priorities',
  'filter.all_statuses': 'All Statuses',
  'filter.unassigned': 'Unassigned',
  'filter.duplicates': 'Duplicates',
  'filter.search_placeholder': 'Search feedbacks...',

  // ==========================================
  // FEEDBACK TYPES
  // ==========================================
  'type.BUG': 'Bug',
  'type.IDEA': 'Idea',
  'type.OTHER': 'Other',
  'type.HELP': 'Help',
  'type.PRAISE': 'Praise',
  'type.QUESTION': 'Question',
  'type.BUG_desc': 'Report a problem or error',
  'type.IDEA_desc': 'Suggest a new feature or improvement',
  'type.OTHER_desc': 'General questions or feedback',
  'type.HELP_desc': 'Need help or confused about something',
  'type.PRAISE_desc': 'Share positive feedback or a compliment',
  'type.QUESTION_desc': 'Ask a question about how something works',

  // Type labels with emojis
  'type.BUG_emoji': 'Bug',
  'type.IDEA_emoji': 'Idea',
  'type.OTHER_emoji': 'Other',
  'type.HELP_emoji': 'Help',
  'type.PRAISE_emoji': 'Praise',
  'type.QUESTION_emoji': 'Question',

  // ==========================================
  // PRIORITY LEVELS
  // ==========================================
  'priority.CRITICAL': 'Critical',
  'priority.HIGH': 'High',
  'priority.MEDIUM': 'Medium',
  'priority.LOW': 'Low',

  'priority.CRITICAL_emoji': 'Critical',
  'priority.HIGH_emoji': 'High',
  'priority.MEDIUM_emoji': 'Medium',
  'priority.LOW_emoji': 'Low',

  'priority.CRITICAL_desc': 'App crash, data loss, security issue',
  'priority.HIGH_desc': 'Major feature broken',
  'priority.MEDIUM_desc': 'Minor bug or inconvenience',
  'priority.LOW_desc': 'Suggestion or enhancement',

  // ==========================================
  // SENTIMENT
  // ==========================================
  'sentiment.FRUSTRATED': 'Frustrated',
  'sentiment.HAPPY': 'Happy',
  'sentiment.NEUTRAL': 'Neutral',
  'sentiment.ANGRY': 'Angry',
  'sentiment.CONFUSED': 'Confused',

  'sentiment.FRUSTRATED_emoji': 'Frustrated',
  'sentiment.HAPPY_emoji': 'Happy',
  'sentiment.NEUTRAL_emoji': 'Neutral',
  'sentiment.ANGRY_emoji': 'Angry',
  'sentiment.CONFUSED_emoji': 'Confused',

  // ==========================================
  // CATEGORIES
  // ==========================================
  'category.UI_ISSUE': 'UI Issue',
  'category.PERFORMANCE': 'Performance',
  'category.SECURITY': 'Security',
  'category.FEATURE_REQUEST': 'Feature Request',
  'category.BUG_REPORT': 'Bug Report',
  'category.DOCUMENTATION': 'Documentation',
  'category.BILLING': 'Billing',
  'category.INTEGRATION': 'Integration',
  'category.OTHER': 'Other',

  'category.UI_ISSUE_emoji': 'UI Issue',
  'category.PERFORMANCE_emoji': 'Performance',
  'category.SECURITY_emoji': 'Security',
  'category.FEATURE_REQUEST_emoji': 'Feature Request',
  'category.BUG_REPORT_emoji': 'Bug Report',
  'category.DOCUMENTATION_emoji': 'Documentation',
  'category.BILLING_emoji': 'Billing',
  'category.INTEGRATION_emoji': 'Integration',
  'category.OTHER_emoji': 'Other',

  // ==========================================
  // STATUS
  // ==========================================
  'status.PENDING': 'Pending',
  'status.IN_PROGRESS': 'In Progress',
  'status.RESOLVED': 'Resolved',
  'status.CLOSED': 'Closed',
  'status.REJECTED': 'Rejected',

  'status.PENDING_emoji': 'Pending',
  'status.IN_PROGRESS_emoji': 'In Progress',
  'status.RESOLVED_emoji': 'Resolved',
  'status.CLOSED_emoji': 'Closed',
  'status.REJECTED_emoji': 'Rejected',

  // ==========================================
  // TEAMS
  // ==========================================
  'team.dev': 'Development',
  'team.design': 'Design',
  'team.support': 'Support',
  'team.product': 'Product',
  'team.security': 'Security',
  'team.finance': 'Finance',

  'team.dev_emoji': 'Development',
  'team.design_emoji': 'Design',
  'team.support_emoji': 'Support',
  'team.product_emoji': 'Product',
  'team.security_emoji': 'Security',
  'team.finance_emoji': 'Finance',

  // ==========================================
  // FEEDBACK CARD / LIST
  // ==========================================
  'feedback.id': 'ID',
  'feedback.type': 'Type',
  'feedback.status': 'Status',
  'feedback.priority': 'Priority',
  'feedback.sentiment': 'Sentiment',
  'feedback.category': 'Category',
  'feedback.team': 'Team',
  'feedback.assigned_to': 'Assigned to',
  'feedback.created_at': 'Created',
  'feedback.updated_at': 'Updated',
  'feedback.ai_analyzed': 'AI Analyzed',
  'feedback.duplicate': 'Duplicate',
  'feedback.view_details': 'View Details',
  'feedback.mark_resolved': 'Mark Resolved',
  'feedback.assign': 'Assign',
  'feedback.no_summary': 'No summary available',
  'feedback.detail_title': 'Feedback Details',
  'feedback.comment': 'Comment',
  'feedback.no_feedbacks': 'No feedbacks yet',
  'feedback.no_feedbacks_desc': 'When users submit feedback, they will appear here',
  'feedback.no_feedbacks_filter': 'No feedbacks match your filters',
  'feedback.try_different_filter': 'Try adjusting your filters to see more results',
  'feedback.clear_filters': 'Clear all filters',

  // ==========================================
  // FEEDBACK DETAIL MODAL
  // ==========================================
  'detail.title': 'Feedback Details',
  'detail.original_message': 'Original Message',
  'detail.translation': 'Translation',
  'detail.screenshot': 'Screenshot',
  'detail.ai_analysis': 'AI Analysis',
  'detail.ai_summary': 'AI Summary',
  'detail.action_items': 'Action Items',
  'detail.ai_response': 'AI Suggested Response',
  'detail.metadata': 'Metadata',
  'detail.copy_id': 'Copy ID',
  'detail.similarity': 'Similarity',
  'detail.confidence': 'Confidence',

  // ==========================================
  // SETTINGS PAGE
  // ==========================================
  'settings.title': 'Settings',
  'settings.subtitle': 'Configure your AI provider',
  'settings.ai_config': 'AI Configuration',
  'settings.ai_description': 'Configure your AI provider for intelligent feedback triage',
  'settings.provider': 'AI Provider',
  'settings.select_provider': 'Select AI Provider',
  'settings.api_key': 'API Key',
  'settings.api_key_placeholder': 'Enter your API key',
  'settings.api_key_help': 'Your API key is stored securely and never shared.',
  'settings.model': 'Model',
  'settings.select_model': 'Select Model',
  'settings.custom_url': 'Custom Base URL',
  'settings.custom_url_placeholder': 'https://api.custom-provider.com/v1',
  'settings.custom_url_help': 'Optional: Only needed for custom deployments',
  'settings.features': 'AI Features',
  'settings.features_description': 'Choose which AI features to enable',
  'settings.thresholds': 'Thresholds',
  'settings.test_connection': 'Test Connection',
  'settings.save_config': 'Save Configuration',
  'settings.disable_ai': 'Disable AI',
  'settings.enable_ai': 'Enable AI',
  'settings.note': 'Note',
  'settings.open_source_note': 'This is an open-source project. You bring your own AI API keys. We never store or share your keys.',
  'settings.api_config': 'API Configuration',
  'settings.api_key_hint': 'Your API key is stored securely and never shared.',
  'settings.get_api_key': 'Get API Key',
  'settings.opensource_notice': 'This is an open-source project. You bring your own AI API keys. We never store or share your keys.',
  'settings.save': 'Save Settings',

  // AI Messages
  'ai.connection_success': 'Connection successful!',
  'ai.connection_failed': 'Connection failed',
  'ai.network_error': 'Network error',
  'ai.settings_saved': 'Settings saved!',
  'ai.settings_failed': 'Failed to save settings',

  // Guardrail Page
  'guardrail.page_title': 'Business Context Guardrail',
  'guardrail.what_is_this': 'What is this?',
  'guardrail.description': 'Describe your application, its industry, and what topics are relevant. The AI will use this context to filter out irrelevant feedback (e.g. a user asking about stock prices inside a school app) and to better categorize and prioritize messages within your domain.',
  'guardrail.context_label': 'Application & Business Context',
  'guardrail.inserting': 'Inserting template...',
  'guardrail.examples_title': 'Quick-fill examples',
  'guardrail.save': 'Save Context',
  'guardrail.placeholder': 'Example: This is a feedback widget for an educational platform used by students and teachers. Relevant topics: lessons, grades, assignments, login issues, platform bugs, feature suggestions for learning tools. Irrelevant: financial advice, real-estate, weather.',

  // Guardrail Examples
  'guardrail.example.school.label': 'School / Education',
  'guardrail.example.school.value': 'This is a feedback widget for an educational platform used by students and teachers. Relevant topics: lessons, grades, assignments, login issues, platform bugs, feature suggestions for learning tools. Irrelevant: financial advice, real-estate, weather, unrelated personal requests.',
  'guardrail.example.ecommerce.label': 'E-commerce',
  'guardrail.example.ecommerce.value': 'This is a feedback widget for an online store. Relevant: product pages, checkout, payment, shipping, returns, account issues, app bugs, feature suggestions. Irrelevant: political opinions, unrelated services, off-topic questions.',
  'guardrail.example.saas.label': 'SaaS / B2B Tool',
  'guardrail.example.saas.value': 'This is a feedback widget for a SaaS project management tool used by teams. Relevant: tasks, projects, collaboration features, integrations, billing, bugs, performance. Irrelevant: personal entertainment, general trivia, unrelated topics.',
  'guardrail.example.healthcare.label': 'Healthcare App',
  'guardrail.example.healthcare.value': 'This is a feedback widget for a healthcare appointment and wellness app. Relevant: scheduling, doctor search, appointment reminders, health records, app bugs. Irrelevant: financial news, unrelated topics, off-topic requests.',

  // Provider Names & Descriptions (for Settings)
  'settings.providers.NONE.name': 'Disabled',
  'settings.providers.NONE.description': 'Run without AI',
  'settings.providers.MOONSHOT.name': 'Moonshot AI',
  'settings.providers.MOONSHOT.description': 'Kimi models - Great for multilingual',
  'settings.providers.ANTHROPIC.name': 'Anthropic Claude',
  'settings.providers.ANTHROPIC.description': 'Claude models - Excellent reasoning',

  // Model display names
  'settings.models.kimi-k2.5': 'Kimi K2.5 - Maximum versatility (Recommended)',
  'settings.models.kimi-k2-0905-preview': 'Kimi K2 - General use, coding',
  'settings.models.kimi-k2-turbo-preview': 'Kimi K2 Turbo - Maximum speed',
  'settings.models.kimi-k2-thinking': 'Kimi K2 Thinking - Deep reasoning',
  'settings.models.claude-sonnet-4-20250514': 'Claude Sonnet 4 - Best balance',
  'settings.models.claude-opus-4-20250514': 'Claude Opus 4 - Most capable',
  'settings.models.claude-haiku-4-20250514': 'Claude Haiku 4 - Fastest',

  // Providers
  'provider.NONE': 'Disabled',
  'provider.NONE_desc': 'Run without AI features',
  'provider.MOONSHOT': 'Moonshot AI (Kimi)',
  'provider.MOONSHOT_desc': 'Great for Chinese & multilingual support',
  'provider.ANTHROPIC': 'Anthropic (Claude)',
  'provider.ANTHROPIC_desc': 'Excellent reasoning and analysis',
  'provider.OPENAI': 'OpenAI (GPT)',
  'provider.OPENAI_desc': 'GPT-4 and GPT-3.5 models',

  'provider.get_key': 'Get API Key',
  'provider.docs': 'Documentation',

  // AI Models
  'model.kimi-k2.5': 'Kimi K2.5',
  'model.kimi-k2.5_desc': 'Maximum versatility - Best overall (Recommended)',
  'model.kimi-k2-0905-preview': 'Kimi K2',
  'model.kimi-k2-0905-preview_desc': 'General use, coding - Best cost-benefit',
  'model.kimi-k2-turbo-preview': 'Kimi K2 Turbo',
  'model.kimi-k2-turbo-preview_desc': 'Maximum speed - When latency is critical',
  'model.kimi-k2-thinking': 'Kimi K2 Thinking',
  'model.kimi-k2-thinking_desc': 'Deep reasoning - Complex problems step-by-step',

  'model.claude-sonnet-4-20250514': 'Claude Sonnet 4',
  'model.claude-sonnet-4-20250514_desc': 'Latest Sonnet - Best balance of speed and quality',
  'model.claude-opus-4-20250514': 'Claude Opus 4',
  'model.claude-opus-4-20250514_desc': 'Most capable - Complex reasoning',
  'model.claude-haiku-4-20250514': 'Claude Haiku 4',
  'model.claude-haiku-4-20250514_desc': 'Fastest - Simple tasks',

  // AI Features
  'feature.auto_categorize': 'Auto-Categorize',
  'feature.auto_categorize_desc': 'Automatically categorize feedback type',
  'feature.validate_type': 'Type Validation',
  'feature.validate_type_desc': 'Check if user selected correct type',
  'feature.priority_scoring': 'Priority Scoring',
  'feature.priority_scoring_desc': 'Auto-assign priority based on content',
  'feature.sentiment_analysis': 'Sentiment Analysis',
  'feature.sentiment_analysis_desc': 'Detect user emotion',
  'feature.auto_response': 'Auto-Response',
  'feature.auto_response_desc': 'Generate helpful response drafts',
  'feature.screenshot_analysis': 'Screenshot Vision',
  'feature.screenshot_analysis_desc': 'Analyze attached screenshots',
  'feature.duplicate_detection': 'Duplicate Detection',
  'feature.duplicate_detection_desc': 'Find similar existing feedbacks',
  'feature.smart_routing': 'Smart Routing',
  'feature.smart_routing_desc': 'Route to correct team automatically',
  'feature.language_detection': 'Language Detection',
  'feature.language_detection_desc': 'Auto-detect user language',

  // Thresholds
  'threshold.min_confidence': 'Minimum Confidence',
  'threshold.min_confidence_desc': 'Minimum confidence for AI suggestions',
  'threshold.duplicate': 'Duplicate Threshold',
  'threshold.duplicate_desc': 'Similarity score for duplicate detection',

  // ==========================================
  // WIDGET STRINGS
  // ==========================================
  'widget.title': 'Send feedback',
  'widget.subtitle': 'What would you like to tell us?',
  'widget.placeholder': 'Tell us what\'s on your mind...',
  'widget.attach_screenshot': 'Attach screenshot',
  'widget.capturing': 'Capturing page...',
  'widget.capturing_wait': 'This may take a moment',
  'widget.screenshot_attached': 'Screenshot attached',
  'widget.screenshot_preview': 'Screenshot preview',
  'widget.remove_screenshot': 'Remove',
  'widget.send': 'Send feedback',
  'widget.sending': 'Sending...',
  'widget.send_anyway': 'Send anyway',
  'widget.irrelevant_title': 'Message not related to this app',
  'widget.irrelevant_message': 'Please send feedback related to this application. Try describing a bug, sharing an idea, or asking a question about a feature.',
  'widget.try_again': 'Try again',
  'widget.thank_you': 'Thank you!',
  'widget.thank_you_message': 'Your feedback helps us improve.',
  'widget.powered_by': 'Powered by Feedback Widget',
  'widget.analyzing': 'Triage assistant analysing...',
  'widget.ai_suggestion': 'AI Suggestion',
  'widget.switch_to': 'Switch to',
  'widget.keep': 'Keep',
  'widget.possible_duplicate': 'Possible duplicate detected',
  'widget.view_similar': 'View similar',
  'widget.ai_response': 'AI Response',
  'widget.ai_analysis': 'AI Analysis',
  'widget.confidence': 'Confidence',
  'widget.detected_language': 'Detected language',
  'widget.char_count': '{{count}}/1000',

  // Widget AI Messages
  'widget.type_mismatch_title': 'Type Mismatch Detected',
  'widget.type_mismatch_desc': 'This looks more like a {{suggested}} than a {{current}}',
  'widget.type_mismatch_reason': 'AI thinks this is a {{suggested}} because: {{reason}}',
  'widget.cannot_send_irrelevant': 'Cannot send - not relevant',
  'widget.review_type_first': 'Review type first',
  'widget.not_related': 'Not related to our platform',

  // ==========================================
  // ERRORS
  // ==========================================
  'error.capture_failed': 'Could not capture screenshot. Please try again.',
  'error.submit_failed': 'Failed to submit feedback. Please try again.',
  'error.ai_analysis_failed': 'AI analysis failed, but your feedback was saved.',
  'error.connection_failed': 'Connection failed. Please check your API key.',
  'error.invalid_api_key': 'Invalid API key. Please check and try again.',
  'error.rate_limit': 'Rate limit exceeded. Please try again later.',
  'error.network': 'Network error. Please check your connection.',
  'error.unknown': 'An unexpected error occurred.',
  'error.not_found': 'Not found.',
  'error.unauthorized': 'Unauthorized. Please check your credentials.',

  // ==========================================
  // SUCCESS MESSAGES
  // ==========================================
  'success.feedback_submitted': 'Feedback submitted successfully!',
  'success.settings_saved': 'Settings saved successfully!',
  'success.connection_success': 'Connection successful!',
  'success.copied': 'Copied to clipboard!',

  // ==========================================
  // HOME / DEMO PAGE
  // ==========================================
  'home.title': 'Feedback Widget',
  'home.subtitle': 'An AI-powered feedback widget with smart triage, sentiment analysis, and multi-language support',
  'home.try_it': 'Try it now!',
  'home.quick_start': 'Quick Start',
  'home.step_1': 'Click the purple button in the bottom-right corner to open the widget',
  'home.step_2': 'Select your language and feedback type',
  'home.step_3': 'Type your feedback - AI will analyze in real-time',
  'home.step_4': 'Go to [link]AI Settings[/link] to add your own API key for testing',

  // Feature cards
  'home.feature_ai_title': 'AI Triage',
  'home.feature_ai_desc': 'Automatic categorization, priority scoring, and sentiment analysis.',
  'home.feature_vision_title': 'Vision AI',
  'home.feature_vision_desc': 'Screenshot capture with AI-powered analysis of UI issues.',
  'home.feature_i18n_title': 'Multi-Language',
  'home.feature_i18n_desc': 'Auto-detection with translation. EN, ES, PT, ZH supported.',

  // Navigation cards
  'home.dashboard_title': 'Admin Dashboard',
  'home.dashboard_desc': 'View incoming feedbacks with AI insights and analytics',
  'home.settings_title': 'AI Settings',
  'home.settings_desc': 'Configure your AI provider (Moonshot/Claude) for testing',

  // Feedback types demo
  'home.report_bug': 'Report bugs',
  'home.share_idea': 'Share ideas',
  'home.ask_question': 'Ask questions',
  'home.try_it_desc': 'Click the purple feedback button in the bottom-right corner. The AI will analyze your feedback in real-time and suggest the correct category, priority, and even generate a response!',

  // Tech stack
  'home.tech_stack': 'Tech Stack',
} as const;

// Type that extracts only the keys (for validating other locales have all keys)
export type TranslationKeys = keyof typeof en;

// Type for a translations object - must have all the same keys as English, but values are strings
export type Translations = Record<TranslationKeys, string>;
