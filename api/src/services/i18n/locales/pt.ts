import type { TranslationKey } from '../index';

export const pt: Record<TranslationKey, string> = {
  // Feedback Types
  'type.bug': 'Erro',
  'type.idea': 'Ideia',
  'type.other': 'Outro',
  
  // Categories
  'category.ui_issue': 'Problema de UI',
  'category.performance': 'Performance',
  'category.security': 'Segurança',
  'category.feature_request': 'Solicitação de recurso',
  'category.bug_report': 'Relatório de erro',
  'category.documentation': 'Documentação',
  'category.billing': 'Faturamento',
  'category.integration': 'Integração',
  'category.other': 'Outro',
  
  // Priority
  'priority.critical': 'Crítica',
  'priority.high': 'Alta',
  'priority.medium': 'Média',
  'priority.low': 'Baixa',
  
  // Sentiment
  'sentiment.frustrated': 'Frustrado',
  'sentiment.happy': 'Feliz',
  'sentiment.neutral': 'Neutro',
  'sentiment.angry': 'Com raiva',
  'sentiment.confused': 'Confuso',
  
  // Status
  'status.pending': 'Pendente',
  'status.in_progress': 'Em andamento',
  'status.resolved': 'Resolvido',
  'status.closed': 'Fechado',
  
  // Teams
  'team.dev': 'Desenvolvimento',
  'team.design': 'Design',
  'team.support': 'Suporte',
  'team.product': 'Produto',
  'team.security': 'Segurança',
  'team.finance': 'Finanças',
  
  // Widget UI
  'widget.title': 'Enviar feedback',
  'widget.subtitle': 'O que você gostaria de nos dizer?',
  'widget.placeholder': 'Conte-nos o que você está pensando...',
  'widget.attach_screenshot': 'Anexar captura',
  'widget.capturing': 'Capturando página...',
  'widget.screenshot_attached': 'Captura anexada',
  'widget.remove_screenshot': 'Remover',
  'widget.send': 'Enviar feedback',
  'widget.sending': 'Enviando...',
  'widget.thank_you': 'Obrigado!',
  'widget.thank_you_message': 'Seu feedback nos ajuda a melhorar.',
  'widget.powered_by': 'Desenvolvido por Feedback Widget',
  'widget.char_count': '{{count}}/1000',
  
  // AI Messages
  'ai.analyzing': 'A IA está analisando seu feedback...',
  'ai.suggested_type': 'A IA sugere que isso é um {{type}}',
  'ai.type_mismatch': 'Isso parece mais um {{suggested}} que um {{current}}',
  'ai.switch_type': 'Mudar para {{type}}',
  'ai.keep_type': 'Manter como {{type}}',
  'ai.duplicate_warning': 'Similar a feedbacks existentes',
  'ai.priority': 'Prioridade: {{priority}}',
  'ai.sentiment': 'Sentimento: {{sentiment}}',
  'ai.auto_response': 'Resposta da IA:',
  'ai.suggested_response': 'Resposta sugerida:',
  
  // Validation
  'validation.type_changed': 'Tipo alterado com base na sugestão da IA',
  'validation.type_mismatch_help': 'Isso parece ser uma pergunta em vez de um relatório de erro. Gostaria de mudar para "Outro"?',
  
  // Errors
  'error.capture_failed': 'Não foi possível capturar a tela. Por favor tente novamente.',
  'error.submit_failed': 'Falha ao enviar o feedback. Por favor tente novamente.',
  'error.ai_failed': 'A análise da IA falhou, mas seu feedback foi salvo.',
};
