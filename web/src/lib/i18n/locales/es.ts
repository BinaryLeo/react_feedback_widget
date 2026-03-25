// Spanish translations
import type { Translations } from './en';

export const es: Translations = {
  // ==========================================
  // COMMON / SHARED STRINGS
  // ==========================================
  'common.loading': 'Cargando...',
  'common.save': 'Guardar',
  'common.saving': 'Guardando...',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',
  'common.edit': 'Editar',
  'common.close': 'Cerrar',
  'common.search': 'Buscar',
  'common.filter': 'Filtrar',
  'common.refresh': 'Actualizar',
  'common.copy': 'Copiar',
  'common.copied': '¡Copiado!',
  'common.error': 'Error',
  'common.success': 'Éxito',
  'common.retry': 'Reintentar',
  'common.show_more': 'Ver más',
  'common.show_less': 'Ver menos',
  'common.back': 'Atrás',
  'common.next': 'Siguiente',
  'common.previous': 'Anterior',
  'common.continue': 'Continuar',
  'common.done': 'Hecho',
  'common.test': 'Probar',
  'common.testing': 'Probando...',
  'common.configure': 'Configurar',
  'common.enabled': 'Activado',
  'common.disabled': 'Desactivado',
  'common.default': 'Predeterminado',
  'common.recommended': 'Recomendado',
  'common.optional': 'Opcional',
  'common.required': 'Requerido',

  // ==========================================
  // NAVIGATION
  // ==========================================
  'nav.dashboard': 'Panel',
  'nav.feedbacks': 'Feedbacks',
  'nav.analytics': 'Análisis',
  'nav.settings': 'Configuración',
  'nav.api_docs': 'Documentación API',
  'nav.logout': 'Cerrar sesión',
  'nav.home': 'Inicio',

  // ==========================================
  // LANGUAGES
  // ==========================================
  'lang.en': 'Inglés',
  'lang.es': 'Español',
  'lang.pt-BR': 'Portugués (Brasil)',
  'lang.zh': 'Chino',
  'lang.select': 'Seleccionar idioma',
  'lang.detected': 'Idioma detectado',
  'lang.switch': 'Cambiar',

  // ==========================================
  // DASHBOARD PAGE
  // ==========================================
  'dashboard.title': 'Panel de Feedback',
  'dashboard.subtitle': 'Triaje con IA',
  'dashboard.total_feedbacks': 'Total de Feedbacks',
  'dashboard.new_today': 'Nuevos Hoy',
  'dashboard.avg_response': 'Tiempo Promedio de Respuesta',
  'dashboard.ai_enabled': 'IA Activada',
  'dashboard.no_feedbacks': 'No se encontraron feedbacks',
  'dashboard.try_adjusting': 'Intenta ajustar tus filtros',

  // ==========================================
  // STATS
  // ==========================================
  'stats.total': 'Total',
  'stats.by_type': 'Por Tipo',
  'stats.by_priority': 'Por Prioridad',
  'stats.by_sentiment': 'Por Sentimiento',
  'stats.by_status': 'Por Estado',
  'stats.by_team': 'Por Equipo',
  'stats.today': 'Hoy',
  'stats.this_week': 'Esta Semana',
  'stats.this_month': 'Este Mes',

  // ==========================================
  // FILTERS
  // ==========================================
  'filter.all': 'Todos los Feedbacks',
  'filter.all_types': 'Todos los Tipos',
  'filter.all_priorities': 'Todas las Prioridades',
  'filter.all_statuses': 'Todos los Estados',
  'filter.unassigned': 'Sin Asignar',
  'filter.duplicates': 'Duplicados',
  'filter.search_placeholder': 'Buscar feedbacks...',

  // ==========================================
  // FEEDBACK TYPES
  // ==========================================
  'type.BUG': 'Error',
  'type.IDEA': 'Idea',
  'type.OTHER': 'Otro',
  'type.HELP': 'Ayuda',
  'type.PRAISE': 'Elogio',
  'type.QUESTION': 'Pregunta',
  'type.BUG_desc': 'Reportar un problema o error',
  'type.IDEA_desc': 'Sugerir una nueva función o mejora',
  'type.OTHER_desc': 'Preguntas generales o feedback',
  'type.HELP_desc': 'Necesitas ayuda o estás confundido con algo',
  'type.PRAISE_desc': 'Compartir un elogio o comentario positivo',
  'type.QUESTION_desc': 'Hacer una pregunta sobre cómo funciona algo',

  // Type emojis
  'type.BUG_emoji': 'Error',
  'type.IDEA_emoji': 'Idea',
  'type.OTHER_emoji': 'Otro',
  'type.HELP_emoji': 'Ayuda',
  'type.PRAISE_emoji': 'Elogio',
  'type.QUESTION_emoji': 'Pregunta',

  // ==========================================
  // PRIORITY LEVELS
  // ==========================================
  'priority.CRITICAL': 'Crítica',
  'priority.HIGH': 'Alta',
  'priority.MEDIUM': 'Media',
  'priority.LOW': 'Baja',
  'priority.CRITICAL_desc': 'App se cierra, pérdida de datos, problema de seguridad',
  'priority.HIGH_desc': 'Función principal rota',
  'priority.MEDIUM_desc': 'Error menor o inconveniente',
  'priority.LOW_desc': 'Sugerencia o mejora',
  'priority.CRITICAL_emoji': 'Crítica',
  'priority.HIGH_emoji': 'Alta',
  'priority.MEDIUM_emoji': 'Media',
  'priority.LOW_emoji': 'Baja',

  // ==========================================
  // SENTIMENT ANALYSIS
  // ==========================================
  'sentiment.FRUSTRATED': 'Frustrado',
  'sentiment.HAPPY': 'Feliz',
  'sentiment.NEUTRAL': 'Neutral',
  'sentiment.ANGRY': 'Enojado',
  'sentiment.CONFUSED': 'Confundido',
  'sentiment.FRUSTRATED_emoji': 'Frustrado',
  'sentiment.HAPPY_emoji': 'Feliz',
  'sentiment.NEUTRAL_emoji': 'Neutral',
  'sentiment.ANGRY_emoji': 'Enojado',
  'sentiment.CONFUSED_emoji': 'Confundido',

  // ==========================================
  // CATEGORIES
  // ==========================================
  'category.UI_ISSUE': 'Problema de UI',
  'category.PERFORMANCE': 'Rendimiento',
  'category.SECURITY': 'Seguridad',
  'category.FEATURE_REQUEST': 'Solicitud de Función',
  'category.BUG_REPORT': 'Reporte de Error',
  'category.DOCUMENTATION': 'Documentación',
  'category.BILLING': 'Facturación',
  'category.INTEGRATION': 'Integración',
  'category.OTHER': 'Otro',
  'category.UI_ISSUE_emoji': 'Problema de UI',
  'category.PERFORMANCE_emoji': 'Rendimiento',
  'category.SECURITY_emoji': 'Seguridad',
  'category.FEATURE_REQUEST_emoji': 'Solicitud de Función',
  'category.BUG_REPORT_emoji': 'Reporte de Error',
  'category.DOCUMENTATION_emoji': 'Documentación',
  'category.BILLING_emoji': 'Facturación',
  'category.INTEGRATION_emoji': 'Integración',
  'category.OTHER_emoji': 'Otro',

  // ==========================================
  // STATUS
  // ==========================================
  'status.PENDING': 'Pendiente',
  'status.IN_PROGRESS': 'En Progreso',
  'status.RESOLVED': 'Resuelto',
  'status.CLOSED': 'Cerrado',
  'status.REJECTED': 'Rechazado',
  'status.PENDING_emoji': 'Pendiente',
  'status.IN_PROGRESS_emoji': 'En Progreso',
  'status.RESOLVED_emoji': 'Resuelto',
  'status.CLOSED_emoji': 'Cerrado',
  'status.REJECTED_emoji': 'Rechazado',

  // ==========================================
  // TEAMS
  // ==========================================
  'team.dev': 'Desarrollo',
  'team.design': 'Diseño',
  'team.support': 'Soporte',
  'team.product': 'Producto',
  'team.security': 'Seguridad',
  'team.finance': 'Finanzas',
  'team.dev_emoji': 'Desarrollo',
  'team.design_emoji': 'Diseño',
  'team.support_emoji': 'Soporte',
  'team.product_emoji': 'Producto',
  'team.security_emoji': 'Seguridad',
  'team.finance_emoji': 'Finanzas',

  // ==========================================
  // FEEDBACK DETAIL
  // ==========================================
  'feedback.id': 'ID',
  'feedback.type': 'Tipo',
  'feedback.status': 'Estado',
  'feedback.priority': 'Prioridad',
  'feedback.sentiment': 'Sentimiento',
  'feedback.category': 'Categoría',
  'feedback.team': 'Equipo',
  'feedback.assigned_to': 'Asignado a',
  'feedback.created_at': 'Creado',
  'feedback.updated_at': 'Actualizado',
  'feedback.ai_analyzed': 'Analizado por IA',
  'feedback.duplicate': 'Duplicado',
  'feedback.view_details': 'Ver Detalles',
  'feedback.mark_resolved': 'Marcar como Resuelto',
  'feedback.assign': 'Asignar',
  'feedback.no_summary': 'No hay resumen disponible',
  'feedback.detail_title': 'Detalles del Feedback',
  'feedback.comment': 'Comentario',
  'feedback.no_feedbacks': 'Aún no hay feedbacks',
  'feedback.no_feedbacks_desc': 'Cuando los usuarios envíen feedbacks, aparecerán aquí',
  'feedback.no_feedbacks_filter': 'Ningún feedback coincide con tus filtros',
  'feedback.try_different_filter': 'Intenta ajustar tus filtros para ver más resultados',
  'feedback.clear_filters': 'Limpiar todos los filtros',

  // ==========================================
  // DETAIL PAGE
  // ==========================================
  'detail.title': 'Detalles del Feedback',
  'detail.original_message': 'Mensaje Original',
  'detail.translation': 'Traducción',
  'detail.screenshot': 'Captura de Pantalla',
  'detail.ai_analysis': 'Análisis de IA',
  'detail.ai_summary': 'Resumen de IA',
  'detail.action_items': 'Elementos de Acción',
  'detail.ai_response': 'Respuesta Sugerida por IA',
  'detail.metadata': 'Metadatos',
  'detail.copy_id': 'Copiar ID',
  'detail.similarity': 'Similitud',
  'detail.confidence': 'Confianza',

  // ==========================================
  // SETTINGS PAGE
  // ==========================================
  'settings.title': 'Configuración',
  'settings.subtitle': 'Configura tu proveedor de IA',
  'settings.ai_config': 'Configuración de IA',
  'settings.ai_description': 'Configura tu proveedor de IA para triaje inteligente de feedbacks',
  'settings.provider': 'Proveedor de IA',
  'settings.select_provider': 'Seleccionar Proveedor de IA',
  'settings.api_key': 'Clave de API',
  'settings.api_key_placeholder': 'Ingresa tu clave de API',
  'settings.api_key_help': 'Tu clave de API se almacena de forma segura y nunca se comparte.',
  'settings.model': 'Modelo',
  'settings.select_model': 'Seleccionar Modelo',
  'settings.custom_url': 'URL Base Personalizada',
  'settings.custom_url_placeholder': 'https://api.custom-provider.com/v1',
  'settings.custom_url_help': 'Opcional: Solo necesario para deployments personalizados',
  'settings.features': 'Funciones de IA',
  'settings.features_description': 'Elige qué funciones de IA habilitar',
  'settings.thresholds': 'Umbrales',
  'settings.test_connection': 'Probar Conexión',
  'settings.save_config': 'Guardar Configuración',
  'settings.disable_ai': 'Desactivar IA',
  'settings.enable_ai': 'Activar IA',
  'settings.note': 'Nota',
  'settings.open_source_note': 'Este es un proyecto de código abierto. Traes tus propias claves de API de IA. Nunca almacenamos ni compartimos tus claves.',
  'settings.api_config': 'Configuración de API',
  'settings.api_key_hint': 'Tu clave API se almacena de forma segura y nunca se comparte.',
  'settings.get_api_key': 'Obtener Clave API',
  'settings.opensource_notice': 'Este es un proyecto de código abierto. Traes tus propias claves de API de IA. Nunca almacenamos ni compartimos tus claves.',
  'settings.save': 'Guardar Configuración',

  // ==========================================
  // AI MESSAGES
  // ==========================================
  'ai.connection_success': '¡Conexión exitosa!',
  'ai.connection_failed': 'Conexión fallida',
  'ai.network_error': 'Error de red',
  'ai.settings_saved': '¡Configuración guardada!',
  'ai.settings_failed': 'Error al guardar la configuración',

  // ==========================================
  // GUARDRAIL PAGE
  // ==========================================
  'guardrail.page_title': 'Contexto de Negocio - Guardrail',
  'guardrail.what_is_this': '¿Qué es esto?',
  'guardrail.description': 'Describe tu aplicación, su industria y qué temas son relevantes. La IA usará este contexto para filtrar feedbacks irrelevantes (ej: un usuario preguntando sobre precios de acciones en una app escolar) y para categorizar y priorizar mejor los mensajes dentro de tu dominio.',
  'guardrail.context_label': 'Contexto de la Aplicación & Negocio',
  'guardrail.inserting': 'Insertando plantilla...',
  'guardrail.examples_title': 'Ejemplos rápidos',
  'guardrail.save': 'Guardar Contexto',
  'guardrail.placeholder': 'Ejemplo: Este es un widget de feedback para una plataforma educativa utilizada por estudiantes y profesores. Temas relevantes: lecciones, calificaciones, tareas, problemas de inicio de sesión, errores de la plataforma, sugerencias de funciones para herramientas de aprendizaje. Irrelevante: consejos financieros, bienes raíces, clima.',

  // ==========================================
  // GUARDRAIL EXAMPLES
  // ==========================================
  'guardrail.example.school.label': 'Escuela / Educación',
  'guardrail.example.school.value': 'Este es un widget de feedback para una plataforma educativa utilizada por estudiantes y profesores. Temas relevantes: lecciones, calificaciones, tareas, problemas de inicio de sesión, errores de la plataforma, sugerencias de funciones para herramientas de aprendizaje. Irrelevante: consejos financieros, bienes raíces, clima, solicitudes personales no relacionadas.',
  'guardrail.example.ecommerce.label': 'E-commerce',
  'guardrail.example.ecommerce.value': 'Este es un widget de feedback para una tienda online. Relevante: páginas de productos, checkout, pago, envío, devoluciones, problemas de cuenta, errores de la app, sugerencias de funciones. Irrelevante: opiniones políticas, servicios no relacionados, preguntas fuera del tema.',
  'guardrail.example.saas.label': 'SaaS / Herramienta B2B',
  'guardrail.example.saas.value': 'Este es un widget de feedback para una herramienta SaaS de gestión de proyectos utilizada por equipos. Relevante: tareas, proyectos, funciones de colaboración, integraciones, facturación, errores, rendimiento. Irrelevante: entretenimiento personal, curiosidades generales, temas no relacionados.',
  'guardrail.example.healthcare.label': 'App de Salud',
  'guardrail.example.healthcare.value': 'Este es un widget de feedback para una app de citas médicas y bienestar. Relevante: programación, búsqueda de doctores, recordatorios de citas, historiales médicos, errores de la app. Irrelevante: noticias financieras, temas no relacionados, solicitudes fuera del tema.',

  // ==========================================
  // PROVIDER NAMES & DESCRIPTIONS
  // ==========================================
  'settings.providers.NONE.name': 'Desactivado',
  'settings.providers.NONE.description': 'Ejecutar sin IA',
  'settings.providers.MOONSHOT.name': 'Moonshot AI',
  'settings.providers.MOONSHOT.description': 'Modelos Kimi - Excelente para multilingüe',
  'settings.providers.ANTHROPIC.name': 'Anthropic Claude',
  'settings.providers.ANTHROPIC.description': 'Modelos Claude - Razonamiento excelente',

  // ==========================================
  // MODEL DISPLAY NAMES
  // ==========================================
  'settings.models.kimi-k2.5': 'Kimi K2.5 - Máxima versatilidad (Recomendado)',
  'settings.models.kimi-k2-0905-preview': 'Kimi K2 - Uso general, código',
  'settings.models.kimi-k2-turbo-preview': 'Kimi K2 Turbo - Máxima velocidad',
  'settings.models.kimi-k2-thinking': 'Kimi K2 Thinking - Razonamiento profundo',
  'settings.models.claude-sonnet-4-20250514': 'Claude Sonnet 4 - Mejor equilibrio',
  'settings.models.claude-opus-4-20250514': 'Claude Opus 4 - Más capaz',
  'settings.models.claude-haiku-4-20250514': 'Claude Haiku 4 - Más rápido',

  // ==========================================
  // PROVIDERS
  // ==========================================
  'provider.NONE': 'Desactivado',
  'provider.NONE_desc': 'Ejecutar sin funciones de IA',
  'provider.MOONSHOT': 'Moonshot AI (Kimi)',
  'provider.MOONSHOT_desc': 'Excelente para chino y soporte multilingüe',
  'provider.ANTHROPIC': 'Anthropic (Claude)',
  'provider.ANTHROPIC_desc': 'Razonamiento y análisis excelentes',
  'provider.OPENAI': 'OpenAI (GPT)',
  'provider.OPENAI_desc': 'Modelos GPT-4 y GPT-3.5',
  'provider.get_key': 'Obtener Clave de API',
  'provider.docs': 'Documentación',

  // ==========================================
  // MODELS
  // ==========================================
  'model.kimi-k2.5': 'Kimi K2.5',
  'model.kimi-k2.5_desc': 'Versatilidad máxima - Mejor en general (Recomendado)',
  'model.kimi-k2-0905-preview': 'Kimi K2',
  'model.kimi-k2-0905-preview_desc': 'Uso general, código - Mejor relación calidad-precio',
  'model.kimi-k2-turbo-preview': 'Kimi K2 Turbo',
  'model.kimi-k2-turbo-preview_desc': 'Velocidad máxima - Cuando la latencia es crítica',
  'model.kimi-k2-thinking': 'Kimi K2 Thinking',
  'model.kimi-k2-thinking_desc': 'Razonamiento profundo - Problemas complejos paso a paso',
  'model.claude-sonnet-4-20250514': 'Claude Sonnet 4',
  'model.claude-sonnet-4-20250514_desc': 'Sonnet más reciente - Mejor equilibrio de velocidad y calidad',
  'model.claude-opus-4-20250514': 'Claude Opus 4',
  'model.claude-opus-4-20250514_desc': 'Más capaz - Razonamiento complejo',
  'model.claude-haiku-4-20250514': 'Claude Haiku 4',
  'model.claude-haiku-4-20250514_desc': 'Más rápido - Tareas simples',

  // ==========================================
  // AI FEATURES
  // ==========================================
  'feature.auto_categorize': 'Auto-Categorización',
  'feature.auto_categorize_desc': 'Categorizar automáticamente el tipo de feedback',
  'feature.validate_type': 'Validación de Tipo',
  'feature.validate_type_desc': 'Verificar si el usuario seleccionó el tipo correcto',
  'feature.priority_scoring': 'Puntuación de Prioridad',
  'feature.priority_scoring_desc': 'Asignar prioridad automáticamente basado en el contenido',
  'feature.sentiment_analysis': 'Análisis de Sentimiento',
  'feature.sentiment_analysis_desc': 'Detectar emoción del usuario',
  'feature.auto_response': 'Auto-Respuesta',
  'feature.auto_response_desc': 'Generar borradores de respuesta útiles',
  'feature.screenshot_analysis': 'Visión de Captura',
  'feature.screenshot_analysis_desc': 'Analizar capturas de pantalla adjuntas',
  'feature.duplicate_detection': 'Detección de Duplicados',
  'feature.duplicate_detection_desc': 'Encontrar feedbacks existentes similares',
  'feature.smart_routing': 'Enrutamiento Inteligente',
  'feature.smart_routing_desc': 'Enrutar al equipo correcto automáticamente',
  'feature.language_detection': 'Detección de Idioma',
  'feature.language_detection_desc': 'Detectar automáticamente el idioma del usuario',

  // ==========================================
  // THRESHOLDS
  // ==========================================
  'threshold.min_confidence': 'Confianza Mínima',
  'threshold.min_confidence_desc': 'Confianza mínima para sugerencias de IA',
  'threshold.duplicate': 'Umbral de Duplicados',
  'threshold.duplicate_desc': 'Puntuación de similitud para detección de duplicados',

  // ==========================================
  // WIDGET
  // ==========================================
  'widget.title': 'Enviar feedback',
  'widget.subtitle': '¿Qué te gustaría contarnos?',
  'widget.placeholder': 'Cuéntanos qué piensas...',
  'widget.attach_screenshot': 'Adjuntar captura',
  'widget.capturing': 'Capturando página...',
  'widget.capturing_wait': 'Esto puede tomar un momento',
  'widget.screenshot_attached': 'Captura adjuntada',
  'widget.screenshot_preview': 'Vista previa de la captura',
  'widget.remove_screenshot': 'Eliminar',
  'widget.send': 'Enviar feedback',
  'widget.sending': 'Enviando...',
  'widget.send_anyway': 'Enviar de todas formas',
  'widget.irrelevant_title': 'Mensaje no relacionado con esta aplicación',
  'widget.irrelevant_message': 'Por favor, envía comentarios relacionados con esta aplicación. Intenta describir un error, compartir una idea o hacer una pregunta sobre una función.',
  'widget.try_again': 'Intentar de nuevo',
  'widget.cannot_send_irrelevant': 'No se puede enviar - no es relevante',
  'widget.review_type_first': 'Revisa el tipo primero',
  'widget.not_related': 'No relacionado con nuestra plataforma',
  'widget.thank_you': '¡Gracias!',
  'widget.thank_you_message': 'Tu feedback nos ayuda a mejorar.',
  'widget.powered_by': 'Desarrollado por Feedback Widget',
  'widget.analyzing': 'Asistente de triaje analizando...',
  'widget.ai_suggestion': 'Sugerencia de IA',
  'widget.switch_to': 'Cambiar a',
  'widget.keep': 'Mantener',
  'widget.possible_duplicate': 'Posible duplicado detectado',
  'widget.view_similar': 'Ver similar',
  'widget.ai_response': 'Respuesta de IA',
  'widget.ai_analysis': 'Análisis de IA',
  'widget.confidence': 'Confianza',
  'widget.detected_language': 'Idioma detectado',
  'widget.char_count': '{{count}}/1000',
  'widget.type_mismatch_title': 'Incompatibilidad de Tipo Detectada',
  'widget.type_mismatch_desc': 'Esto parece más un {{suggested}} que un {{current}}',
  'widget.type_mismatch_reason': 'La IA cree que esto es un {{suggested}} porque: {{reason}}',

  // ==========================================
  // ERRORS
  // ==========================================
  'error.capture_failed': 'No se pudo capturar la pantalla. Por favor intenta de nuevo.',
  'error.submit_failed': 'Error al enviar feedback. Por favor intenta de nuevo.',
  'error.ai_analysis_failed': 'El análisis de IA falló, pero tu feedback fue guardado.',
  'error.connection_failed': 'Error de conexión. Por favor verifica tu clave de API.',
  'error.invalid_api_key': 'Clave de API inválida. Por favor verifica e intenta de nuevo.',
  'error.rate_limit': 'Límite de tasa excedido. Por favor intenta más tarde.',
  'error.network': 'Error de red. Por favor verifica tu conexión.',
  'error.unknown': 'Ocurrió un error inesperado.',
  'error.not_found': 'No encontrado.',
  'error.unauthorized': 'No autorizado. Por favor verifica tus credenciales.',

  // ==========================================
  // SUCCESS MESSAGES
  // ==========================================
  'success.feedback_submitted': '¡Feedback enviado exitosamente!',
  'success.settings_saved': '¡Configuración guardada exitosamente!',
  'success.connection_success': '¡Conexión exitosa!',
  'success.copied': '¡Copiado al portapapeles!',

  // ==========================================
  // HOME PAGE
  // ==========================================
  'home.title': 'Feedback Widget',
  'home.subtitle': 'Un widget de feedback con IA para triaje inteligente, análisis de sentimiento y soporte multilingüe',
  'home.try_it': '¡Pruébalo ahora!',
  'home.quick_start': 'Inicio Rápido',
  'home.step_1': 'Haz clic en el botón morado en la esquina inferior derecha para abrir el widget',
  'home.step_2': 'Selecciona tu idioma y tipo de feedback',
  'home.step_3': 'Escribe tu feedback - La IA analizará en tiempo real',
  'home.step_4': 'Ve a [link]Configuraciones de IA[/link] para agregar tu propia clave de API para pruebas',
  'home.feature_ai_title': 'Triaje con IA',
  'home.feature_ai_desc': 'Categorización automática, puntuación de prioridad y análisis de sentimiento.',
  'home.feature_vision_title': 'Visión con IA',
  'home.feature_vision_desc': 'Captura de pantalla con análisis de problemas de UI por IA.',
  'home.feature_i18n_title': 'Multi-Idioma',
  'home.feature_i18n_desc': 'Detección automática con traducción. Soporte para EN, ES, PT, ZH.',
  'home.dashboard_title': 'Panel de Admin',
  'home.dashboard_desc': 'Ve feedbacks entrantes con insights de IA y análisis',
  'home.settings_title': 'Configuraciones de IA',
  'home.settings_desc': 'Configura tu proveedor de IA (Moonshot/Claude) para pruebas',
  'home.report_bug': 'Reportar errores',
  'home.share_idea': 'Compartir ideas',
  'home.ask_question': 'Hacer preguntas',
  'home.try_it_desc': 'Haz clic en el botón de feedback púrpura en la esquina inferior derecha. La IA analizará tu feedback en tiempo real y sugerirá la categoría correcta, prioridad e incluso generará una respuesta.',
  'home.tech_stack': 'Stack Tecnológico',
};
