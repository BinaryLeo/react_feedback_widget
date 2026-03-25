export const zh = {
  // Feedback Types
  'type.bug': '错误',
  'type.idea': '建议',
  'type.other': '其他',
  
  // Categories
  'category.ui_issue': 'UI 问题',
  'category.performance': '性能',
  'category.security': '安全',
  'category.feature_request': '功能请求',
  'category.bug_report': '错误报告',
  'category.documentation': '文档',
  'category.billing': '账单',
  'category.integration': '集成',
  'category.other': '其他',
  
  // Priority
  'priority.critical': '严重',
  'priority.high': '高',
  'priority.medium': '中',
  'priority.low': '低',
  
  // Sentiment
  'sentiment.frustrated': '沮丧',
  'sentiment.happy': '开心',
  'sentiment.neutral': '中性',
  'sentiment.angry': '生气',
  'sentiment.confused': '困惑',
  
  // Status
  'status.pending': '待处理',
  'status.in_progress': '处理中',
  'status.resolved': '已解决',
  'status.closed': '已关闭',
  
  // Teams
  'team.dev': '开发',
  'team.design': '设计',
  'team.support': '支持',
  'team.product': '产品',
  'team.security': '安全',
  'team.finance': '财务',
  
  // Widget UI
  'widget.title': '发送反馈',
  'widget.subtitle': '您想告诉我们什么？',
  'widget.placeholder': '告诉我们您的想法...',
  'widget.attach_screenshot': '附加截图',
  'widget.capturing': '正在捕获页面...',
  'widget.screenshot_attached': '截图已附加',
  'widget.remove_screenshot': '移除',
  'widget.send': '发送反馈',
  'widget.sending': '发送中...',
  'widget.thank_you': '谢谢！',
  'widget.thank_you_message': '您的反馈帮助我们改进。',
  'widget.powered_by': '由 Feedback Widget 提供支持',
  'widget.char_count': '{{count}}/1000',
  
  // AI Messages
  'ai.analyzing': 'AI 正在分析您的反馈...',
  'ai.suggested_type': 'AI 建议这是 {{type}}',
  'ai.type_mismatch': '这看起来更像 {{suggested}} 而不是 {{current}}',
  'ai.switch_type': '切换到 {{type}}',
  'ai.keep_type': '保持为 {{type}}',
  'ai.duplicate_warning': '与现有反馈相似',
  'ai.priority': '优先级：{{priority}}',
  'ai.sentiment': '情感：{{sentiment}}',
  'ai.auto_response': 'AI 回复：',
  'ai.suggested_response': '建议回复：',
  
  // Validation
  'validation.type_changed': '根据 AI 建议更改了类型',
  'validation.type_mismatch_help': '这看起来更像一个问题而不是错误报告。您想更改为"其他"吗？',
  
  // Errors
  'error.capture_failed': '无法捕获截图。请重试。',
  'error.submit_failed': '提交反馈失败。请重试。',
  'error.ai_failed': 'AI 分析失败，但您的反馈已保存。',
} as const;
