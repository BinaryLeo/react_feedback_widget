import type { TranslationKey } from '../index';

export const es: Record<TranslationKey, string> = {
  // Feedback Types
  'type.bug': 'Error',
  'type.idea': 'Idea',
  'type.other': 'Otro',
  
  // Categories
  'category.ui_issue': 'Problema de UI',
  'category.performance': 'Rendimiento',
  'category.security': 'Seguridad',
  'category.feature_request': 'Solicitud de función',
  'category.bug_report': 'Reporte de error',
  'category.documentation': 'Documentación',
  'category.billing': 'Facturación',
  'category.integration': 'Integración',
  'category.other': 'Otro',
  
  // Priority
  'priority.critical': 'Crítica',
  'priority.high': 'Alta',
  'priority.medium': 'Media',
  'priority.low': 'Baja',
  
  // Sentiment
  'sentiment.frustrated': 'Frustrado',
  'sentiment.happy': 'Feliz',
  'sentiment.neutral': 'Neutral',
  'sentiment.angry': 'Enojado',
  'sentiment.confused': 'Confundido',
  
  // Status
  'status.pending': 'Pendiente',
  'status.in_progress': 'En progreso',
  'status.resolved': 'Resuelto',
  'status.closed': 'Cerrado',
  
  // Teams
  'team.dev': 'Desarrollo',
  'team.design': 'Diseño',
  'team.support': 'Soporte',
  'team.product': 'Producto',
  'team.security': 'Seguridad',
  'team.finance': 'Finanzas',
  
  // Widget UI
  'widget.title': 'Enviar comentario',
  'widget.subtitle': '¿Qué te gustaría contarnos?',
  'widget.placeholder': 'Cuéntanos qué piensas...',
  'widget.attach_screenshot': 'Adjuntar captura',
  'widget.capturing': 'Capturando página...',
  'widget.screenshot_attached': 'Captura adjuntada',
  'widget.remove_screenshot': 'Eliminar',
  'widget.send': 'Enviar comentario',
  'widget.sending': 'Enviando...',
  'widget.thank_you': '¡Gracias!',
  'widget.thank_you_message': 'Tus comentarios nos ayudan a mejorar.',
  'widget.powered_by': 'Desarrollado por Feedback Widget',
  'widget.char_count': '{{count}}/1000',
  
  // AI Messages
  'ai.analyzing': 'La IA está analizando tu comentario...',
  'ai.suggested_type': 'La IA sugiere que esto es un {{type}}',
  'ai.type_mismatch': 'Esto parece más un {{suggested}} que un {{current}}',
  'ai.switch_type': 'Cambiar a {{type}}',
  'ai.keep_type': 'Mantener como {{type}}',
  'ai.duplicate_warning': 'Similar a comentarios existentes',
  'ai.priority': 'Prioridad: {{priority}}',
  'ai.sentiment': 'Sentimiento: {{sentiment}}',
  'ai.auto_response': 'Respuesta de IA:',
  'ai.suggested_response': 'Respuesta sugerida:',
  
  // Validation
  'validation.type_changed': 'Tipo cambiado según sugerencia de IA',
  'validation.type_mismatch_help': 'Esto parece ser una pregunta en lugar de un reporte de error. ¿Te gustaría cambiar a "Otro"?',
  
  // Errors
  'error.capture_failed': 'No se pudo capturar la pantalla. Por favor intenta de nuevo.',
  'error.submit_failed': 'Error al enviar el comentario. Por favor intenta de nuevo.',
  'error.ai_failed': 'El análisis de IA falló, pero tu comentario fue guardado.',
};
