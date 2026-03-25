export const en = {
  // Feedback Types
  'type.bug': 'Bug',
  'type.idea': 'Idea',
  'type.other': 'Other',
  
  // Categories
  'category.ui_issue': 'UI Issue',
  'category.performance': 'Performance',
  'category.security': 'Security',
  'category.feature_request': 'Feature Request',
  'category.bug_report': 'Bug Report',
  'category.documentation': 'Documentation',
  'category.billing': 'Billing',
  'category.integration': 'Integration',
  'category.other': 'Other',
  
  // Priority
  'priority.critical': 'Critical',
  'priority.high': 'High',
  'priority.medium': 'Medium',
  'priority.low': 'Low',
  
  // Sentiment
  'sentiment.frustrated': 'Frustrated',
  'sentiment.happy': 'Happy',
  'sentiment.neutral': 'Neutral',
  'sentiment.angry': 'Angry',
  'sentiment.confused': 'Confused',
  
  // Status
  'status.pending': 'Pending',
  'status.in_progress': 'In Progress',
  'status.resolved': 'Resolved',
  'status.closed': 'Closed',
  
  // Teams
  'team.dev': 'Development',
  'team.design': 'Design',
  'team.support': 'Support',
  'team.product': 'Product',
  'team.security': 'Security',
  'team.finance': 'Finance',
  
  // Widget UI
  'widget.title': 'Send feedback',
  'widget.subtitle': 'What would you like to tell us?',
  'widget.placeholder': 'Tell us what\'s on your mind...',
  'widget.attach_screenshot': 'Attach screenshot',
  'widget.capturing': 'Capturing page...',
  'widget.screenshot_attached': 'Screenshot attached',
  'widget.remove_screenshot': 'Remove',
  'widget.send': 'Send feedback',
  'widget.sending': 'Sending...',
  'widget.thank_you': 'Thank you!',
  'widget.thank_you_message': 'Your feedback helps us improve.',
  'widget.powered_by': 'Powered by Feedback Widget',
  'widget.char_count': '{{count}}/1000',
  
  // AI Messages
  'ai.analyzing': 'AI is analyzing your feedback...',
  'ai.suggested_type': 'AI suggests this is a {{type}}',
  'ai.type_mismatch': 'This looks more like a {{suggested}} than a {{current}}',
  'ai.switch_type': 'Switch to {{type}}',
  'ai.keep_type': 'Keep as {{type}}',
  'ai.duplicate_warning': 'Similar to existing feedback',
  'ai.priority': 'Priority: {{priority}}',
  'ai.sentiment': 'Sentiment: {{sentiment}}',
  'ai.auto_response': 'AI Response:',
  'ai.suggested_response': 'Suggested response:',
  
  // Validation
  'validation.type_changed': 'Type changed based on AI suggestion',
  'validation.type_mismatch_help': 'This appears to be a question rather than a bug report. Would you like to change to "Other"?',
  
  // Errors
  'error.capture_failed': 'Could not capture screenshot. Please try again.',
  'error.submit_failed': 'Failed to submit feedback. Please try again.',
  'error.ai_failed': 'AI analysis failed, but your feedback was saved.',
} as const;
