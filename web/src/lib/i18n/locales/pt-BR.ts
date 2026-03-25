// Portuguese (Brazil) translations
import type { Translations } from './en';

export const ptBR: Translations = {
  // ==========================================
  // COMMON / SHARED STRINGS
  // ==========================================
  'common.loading': 'Carregando...',
  'common.save': 'Salvar',
  'common.saving': 'Salvando...',
  'common.cancel': 'Cancelar',
  'common.delete': 'Excluir',
  'common.edit': 'Editar',
  'common.close': 'Fechar',
  'common.search': 'Buscar',
  'common.filter': 'Filtrar',
  'common.refresh': 'Atualizar',
  'common.copy': 'Copiar',
  'common.copied': 'Copiado!',
  'common.error': 'Erro',
  'common.success': 'Sucesso',
  'common.retry': 'Tentar novamente',
  'common.show_more': 'Ver mais',
  'common.show_less': 'Ver menos',
  'common.back': 'Voltar',
  'common.next': 'Próximo',
  'common.previous': 'Anterior',
  'common.continue': 'Continuar',
  'common.done': 'Concluído',
  'common.test': 'Testar',
  'common.testing': 'Testando...',
  'common.configure': 'Configurar',
  'common.enabled': 'Ativado',
  'common.disabled': 'Desativado',
  'common.default': 'Padrão',
  'common.recommended': 'Recomendado',
  'common.optional': 'Opcional',
  'common.required': 'Obrigatório',

  // ==========================================
  // NAVIGATION
  // ==========================================
  'nav.dashboard': 'Painel',
  'nav.feedbacks': 'Feedbacks',
  'nav.analytics': 'Análises',
  'nav.settings': 'Configurações',
  'nav.api_docs': 'Documentação API',
  'nav.logout': 'Sair',
  'nav.home': 'Início',

  // ==========================================
  // LANGUAGES
  // ==========================================
  'lang.en': 'Inglês',
  'lang.es': 'Espanhol',
  'lang.pt-BR': 'Português (Brasil)',
  'lang.zh': 'Chinês',
  'lang.select': 'Selecionar Idioma',
  'lang.detected': 'Idioma detectado',
  'lang.switch': 'Mudar',

  // ==========================================
  // DASHBOARD PAGE
  // ==========================================
  'dashboard.title': 'Painel de Feedbacks',
  'dashboard.subtitle': 'Triagem com IA',
  'dashboard.total_feedbacks': 'Total de Feedbacks',
  'dashboard.new_today': 'Novos Hoje',
  'dashboard.avg_response': 'Tempo Médio de Resposta',
  'dashboard.ai_enabled': 'IA Ativada',
  'dashboard.no_feedbacks': 'Nenhum feedback encontrado',
  'dashboard.try_adjusting': 'Tente ajustar seus filtros',

  // ==========================================
  // STATS
  // ==========================================
  'stats.total': 'Total',
  'stats.by_type': 'Por Tipo',
  'stats.by_priority': 'Por Prioridade',
  'stats.by_sentiment': 'Por Sentimento',
  'stats.by_status': 'Por Status',
  'stats.by_team': 'Por Equipe',
  'stats.today': 'Hoje',
  'stats.this_week': 'Esta Semana',
  'stats.this_month': 'Este Mês',

  // ==========================================
  // FILTERS
  // ==========================================
  'filter.all': 'Todos os Feedbacks',
  'filter.all_types': 'Todos os Tipos',
  'filter.all_priorities': 'Todas as Prioridades',
  'filter.all_statuses': 'Todos os Status',
  'filter.unassigned': 'Não Atribuídos',
  'filter.duplicates': 'Duplicados',
  'filter.search_placeholder': 'Buscar feedbacks...',

  // ==========================================
  // FEEDBACK TYPES
  // ==========================================
  'type.BUG': 'Erro',
  'type.IDEA': 'Ideia',
  'type.OTHER': 'Outro',
  'type.HELP': 'Ajuda',
  'type.PRAISE': 'Elogio',
  'type.QUESTION': 'Dúvida',
  'type.BUG_desc': 'Reportar um problema ou erro',
  'type.IDEA_desc': 'Sugerir uma nova funcionalidade ou melhoria',
  'type.OTHER_desc': 'Perguntas gerais ou feedback',
  'type.HELP_desc': 'Precisa de ajuda ou está com dificuldade',
  'type.PRAISE_desc': 'Compartilhe um elogio ou feedback positivo',
  'type.QUESTION_desc': 'Faça uma pergunta sobre como algo funciona',
  'type.BUG_emoji': 'Erro',
  'type.IDEA_emoji': 'Ideia',
  'type.OTHER_emoji': 'Outro',
  'type.HELP_emoji': 'Ajuda',
  'type.PRAISE_emoji': 'Elogio',
  'type.QUESTION_emoji': 'Dúvida',

  // ==========================================
  // PRIORITY LEVELS
  // ==========================================
  'priority.CRITICAL': 'Crítica',
  'priority.HIGH': 'Alta',
  'priority.MEDIUM': 'Média',
  'priority.LOW': 'Baixa',
  'priority.CRITICAL_emoji': 'Crítica',
  'priority.HIGH_emoji': 'Alta',
  'priority.MEDIUM_emoji': 'Média',
  'priority.LOW_emoji': 'Baixa',
  'priority.CRITICAL_desc': 'App travando, perda de dados, problema de segurança',
  'priority.HIGH_desc': 'Funcionalidade principal quebrada',
  'priority.MEDIUM_desc': 'Bug menor ou inconveniente',
  'priority.LOW_desc': 'Sugestão ou melhoria',

  // ==========================================
  // SENTIMENT ANALYSIS
  // ==========================================
  'sentiment.FRUSTRATED': 'Frustrado',
  'sentiment.HAPPY': 'Feliz',
  'sentiment.NEUTRAL': 'Neutro',
  'sentiment.ANGRY': 'Com raiva',
  'sentiment.CONFUSED': 'Confuso',
  'sentiment.FRUSTRATED_emoji': 'Frustrado',
  'sentiment.HAPPY_emoji': 'Feliz',
  'sentiment.NEUTRAL_emoji': 'Neutro',
  'sentiment.ANGRY_emoji': 'Com raiva',
  'sentiment.CONFUSED_emoji': 'Confuso',

  // ==========================================
  // CATEGORIES
  // ==========================================
  'category.UI_ISSUE': 'Problema de UI',
  'category.PERFORMANCE': 'Performance',
  'category.SECURITY': 'Segurança',
  'category.FEATURE_REQUEST': 'Solicitação de Funcionalidade',
  'category.BUG_REPORT': 'Relatório de Erro',
  'category.DOCUMENTATION': 'Documentação',
  'category.BILLING': 'Faturamento',
  'category.INTEGRATION': 'Integração',
  'category.OTHER': 'Outro',
  'category.UI_ISSUE_emoji': 'Problema UI',
  'category.PERFORMANCE_emoji': 'Performance',
  'category.SECURITY_emoji': 'Segurança',
  'category.FEATURE_REQUEST_emoji': 'Solicitação',
  'category.BUG_REPORT_emoji': 'Bug',
  'category.DOCUMENTATION_emoji': 'Documentação',
  'category.BILLING_emoji': 'Cobrança',
  'category.INTEGRATION_emoji': 'Integração',
  'category.OTHER_emoji': 'Outro',

  // ==========================================
  // STATUS
  // ==========================================
  'status.PENDING': 'Pendente',
  'status.IN_PROGRESS': 'Em Andamento',
  'status.RESOLVED': 'Resolvido',
  'status.CLOSED': 'Fechado',
  'status.REJECTED': 'Rejeitado',
  'status.PENDING_emoji': 'Pendente',
  'status.IN_PROGRESS_emoji': 'Em Andamento',
  'status.RESOLVED_emoji': 'Resolvido',
  'status.CLOSED_emoji': 'Fechado',
  'status.REJECTED_emoji': 'Rejeitado',

  // ==========================================
  // TEAMS
  // ==========================================
  'team.dev': 'Desenvolvimento',
  'team.design': 'Design',
  'team.support': 'Suporte',
  'team.product': 'Produto',
  'team.security': 'Segurança',
  'team.finance': 'Finanças',
  'team.dev_emoji': '💻 Desenvolvimento',
  'team.design_emoji': '🎨 Design',
  'team.support_emoji': '🎧 Suporte',
  'team.product_emoji': '📦 Produto',
  'team.security_emoji': '🔐 Segurança',
  'team.finance_emoji': '💰 Finanças',

  // ==========================================
  // FEEDBACK DETAIL
  // ==========================================
  'feedback.id': 'ID',
  'feedback.type': 'Tipo',
  'feedback.status': 'Status',
  'feedback.priority': 'Prioridade',
  'feedback.sentiment': 'Sentimento',
  'feedback.category': 'Categoria',
  'feedback.team': 'Equipe',
  'feedback.assigned_to': 'Atribuído a',
  'feedback.created_at': 'Criado em',
  'feedback.updated_at': 'Atualizado em',
  'feedback.ai_analyzed': 'Analisado por IA',
  'feedback.duplicate': 'Duplicado',
  'feedback.view_details': 'Ver Detalhes',
  'feedback.mark_resolved': 'Marcar como Resolvido',
  'feedback.assign': 'Atribuir',
  'feedback.no_summary': 'Nenhum resumo disponível',
  'feedback.detail_title': 'Detalhes do Feedback',
  'feedback.comment': 'Comentário',
  'feedback.no_feedbacks': 'Nenhum feedback ainda',
  'feedback.no_feedbacks_desc': 'Quando os usuários enviarem feedbacks, eles aparecerão aqui',
  'feedback.no_feedbacks_filter': 'Nenhum feedback corresponde aos filtros',
  'feedback.try_different_filter': 'Tente ajustar seus filtros para ver mais resultados',
  'feedback.clear_filters': 'Limpar todos os filtros',

  // ==========================================
  // DETAIL PAGE
  // ==========================================
  'detail.title': 'Detalhes do Feedback',
  'detail.original_message': 'Mensagem Original',
  'detail.translation': 'Tradução',
  'detail.screenshot': 'Captura de Tela',
  'detail.ai_analysis': 'Análise da IA',
  'detail.ai_summary': 'Resumo da IA',
  'detail.action_items': 'Itens de Ação',
  'detail.ai_response': 'Resposta Sugerida pela IA',
  'detail.metadata': 'Metadados',
  'detail.copy_id': 'Copiar ID',
  'detail.similarity': 'Similaridade',
  'detail.confidence': 'Confiança',

  // ==========================================
  // SETTINGS PAGE
  // ==========================================
  'settings.title': 'Configurações',
  'settings.subtitle': 'Configure seu provedor de IA',
  'settings.ai_config': 'Configuração de IA',
  'settings.ai_description': 'Configure seu provedor de IA para triagem inteligente de feedbacks',
  'settings.provider': 'Provedor de IA',
  'settings.select_provider': 'Selecionar Provedor de IA',
  'settings.api_key': 'Chave de API',
  'settings.api_key_placeholder': 'Digite sua chave de API',
  'settings.api_key_help': 'Sua chave de API é armazenada com segurança e nunca compartilhada.',
  'settings.model': 'Modelo',
  'settings.select_model': 'Selecionar Modelo',
  'settings.custom_url': 'URL Base Personalizada',
  'settings.custom_url_placeholder': 'https://api.custom-provider.com/v1',
  'settings.custom_url_help': 'Opcional: Apenas necessário para deployments customizados',
  'settings.features': 'Recursos de IA',
  'settings.features_description': 'Escolha quais recursos de IA ativar',
  'settings.thresholds': 'Limites',
  'settings.test_connection': 'Testar Conexão',
  'settings.save_config': 'Salvar Configuração',
  'settings.disable_ai': 'Desativar IA',
  'settings.enable_ai': 'Ativar IA',
  'settings.note': 'Nota',
  'settings.open_source_note': 'Este é um projeto open-source. Você usa suas próprias chaves de API. Nunca armazenamos ou compartilhamos suas chaves.',
  'settings.api_config': 'Configuração de API',
  'settings.api_key_hint': 'Sua chave API é armazenada com segurança e nunca compartilhada.',
  'settings.get_api_key': 'Obter Chave API',
  'settings.opensource_notice': 'Este é um projeto open-source. Você usa suas próprias chaves de API. Nunca armazenamos ou compartilhamos suas chaves.',
  'settings.save': 'Salvar Configurações',

  // ==========================================
  // AI MESSAGES
  // ==========================================
  'ai.connection_success': 'Conexão bem-sucedida!',
  'ai.connection_failed': 'Conexão falhou',
  'ai.network_error': 'Erro de rede',
  'ai.settings_saved': 'Configurações salvas!',
  'ai.settings_failed': 'Falha ao salvar configurações',

  // ==========================================
  // GUARDRAIL PAGE
  // ==========================================
  'guardrail.page_title': 'Contexto de Negócio - Guardrail',
  'guardrail.what_is_this': 'O que é isso?',
  'guardrail.description': 'Descreva sua aplicação, seu setor e quais tópicos são relevantes. A IA usará esse contexto para filtrar feedbacks irrelevantes (ex: um usuário perguntando sobre preços de ações em um app escolar) e para categorizar e priorizar melhor as mensagens no seu domínio.',
  'guardrail.context_label': 'Contexto da Aplicação & Negócio',
  'guardrail.inserting': 'Inserindo modelo...',
  'guardrail.examples_title': 'Exemplos rápidos',
  'guardrail.save': 'Salvar Contexto',
  'guardrail.placeholder': 'Exemplo: Este é um widget de feedback para uma plataforma educacional usada por estudantes e professores. Tópicos relevantes: lições, notas, tarefas, problemas de login, bugs da plataforma, sugestões de recursos para ferramentas de aprendizado. Irrelevante: conselhos financeiros, imóveis, clima.',
  
  // ==========================================
  // GUARDRAIL EXAMPLES
  // ==========================================
  'guardrail.example.school.label': 'Escola / Educação',
  'guardrail.example.school.value': 'Este é um widget de feedback para uma plataforma educacional usada por estudantes e professores. Tópicos relevantes: lições, notas, tarefas, problemas de login, bugs da plataforma, sugestões de recursos para ferramentas de aprendizado. Irrelevante: conselhos financeiros, imóveis, clima, solicitações pessoais não relacionadas.',
  'guardrail.example.ecommerce.label': 'E-commerce',
  'guardrail.example.ecommerce.value': 'Este é um widget de feedback para uma loja online. Relevante: páginas de produtos, checkout, pagamento, envio, devoluções, problemas de conta, bugs do app, sugestões de recursos. Irrelevante: opiniões políticas, serviços não relacionados, perguntas fora do tema.',
  'guardrail.example.saas.label': 'SaaS / Ferramenta B2B',
  'guardrail.example.saas.value': 'Este é um widget de feedback para uma ferramenta SaaS de gerenciamento de projetos usada por equipes. Relevante: tarefas, projetos, recursos de colaboração, integrações, faturamento, bugs, performance. Irrelevante: entretenimento pessoal, curiosidades gerais, tópicos não relacionados.',
  'guardrail.example.healthcare.label': 'App de Saúde',
  'guardrail.example.healthcare.value': 'Este é um widget de feedback para um app de consultas médicas e bem-estar. Relevante: agendamento, busca de médicos, lembretes de consultas, prontuários, bugs do app. Irrelevante: notícias financeiras, tópicos não relacionados, solicitações fora do tema.',

  // ==========================================
  // PROVIDER NAMES & DESCRIPTIONS
  // ========================================== Names & Descriptions (for Settings)
  'settings.providers.NONE.name': 'Desativado',
  'settings.providers.NONE.description': 'Executar sem IA',
  'settings.providers.MOONSHOT.name': 'Moonshot AI',
  'settings.providers.MOONSHOT.description': 'Modelos Kimi - Ótimo para multilíngue',
  'settings.providers.ANTHROPIC.name': 'Anthropic Claude',
  'settings.providers.ANTHROPIC.description': 'Modelos Claude - Raciocínio excelente',

  // Model display names
  'settings.models.kimi-k2.5': 'Kimi K2.5 - Máxima versatilidade (Recomendado)',
  'settings.models.kimi-k2-0905-preview': 'Kimi K2 - Uso geral, código',
  'settings.models.kimi-k2-turbo-preview': 'Kimi K2 Turbo - Máxima velocidade',
  'settings.models.kimi-k2-thinking': 'Kimi K2 Thinking - Raciocínio profundo',
  'settings.models.claude-sonnet-4-20250514': 'Claude Sonnet 4 - Melhor equilíbrio',
  'settings.models.claude-opus-4-20250514': 'Claude Opus 4 - Mais capaz',
  'settings.models.claude-haiku-4-20250514': 'Claude Haiku 4 - Mais rápido',

  // ==========================================
  // PROVIDER NAMES & DESCRIPTIONS
  // ==========================================s
  'provider.NONE': 'Desativado',
  'provider.NONE_desc': 'Executar sem recursos de IA',
  'provider.MOONSHOT': 'Moonshot AI (Kimi)',
  'provider.MOONSHOT_desc': 'Ótimo para chinês e suporte multilíngue',
  'provider.ANTHROPIC': 'Anthropic (Claude)',
  'provider.ANTHROPIC_desc': 'Excelente raciocínio e análise',
  'provider.OPENAI': 'OpenAI (GPT)',
  'provider.OPENAI_desc': 'Modelos GPT-4 e GPT-3.5',
  'provider.get_key': 'Obter Chave de API',
  'provider.docs': 'Documentação',

  // Models
  'model.kimi-k2.5': 'Kimi K2.5',
  'model.kimi-k2.5_desc': 'Versatilidade máxima - Melhor em geral (Recomendado)',
  'model.kimi-k2-0905-preview': 'Kimi K2',
  'model.kimi-k2-0905-preview_desc': 'Uso geral, código - Melhor custo-benefício',
  'model.kimi-k2-turbo-preview': 'Kimi K2 Turbo',
  'model.kimi-k2-turbo-preview_desc': 'Velocidade máxima - Quando latência é crítica',
  'model.kimi-k2-thinking': 'Kimi K2 Thinking',
  'model.kimi-k2-thinking_desc': 'Raciocínio profundo - Problemas complexos passo a passo',
  'model.claude-sonnet-4-20250514': 'Claude Sonnet 4',
  'model.claude-sonnet-4-20250514_desc': 'Sonnet mais recente - Melhor equilíbrio de velocidade e qualidade',
  'model.claude-opus-4-20250514': 'Claude Opus 4',
  'model.claude-opus-4-20250514_desc': 'Mais capaz - Raciocínio complexo',
  'model.claude-haiku-4-20250514': 'Claude Haiku 4',
  'model.claude-haiku-4-20250514_desc': 'Mais rápido - Tarefas simples',

  // Features
  'feature.auto_categorize': 'Auto-Categorização',
  'feature.auto_categorize_desc': 'Categorizar automaticamente o tipo de feedback',
  'feature.validate_type': 'Validação de Tipo',
  'feature.validate_type_desc': 'Verificar se usuário selecionou tipo correto',
  'feature.priority_scoring': 'Pontuação de Prioridade',
  'feature.priority_scoring_desc': 'Atribuir prioridade automaticamente baseado no conteúdo',
  'feature.sentiment_analysis': 'Análise de Sentimento',
  'feature.sentiment_analysis_desc': 'Detectar emoção do usuário',
  'feature.auto_response': 'Auto-Resposta',
  'feature.auto_response_desc': 'Gerar rascunhos de resposta úteis',
  'feature.screenshot_analysis': 'Visão de Captura',
  'feature.screenshot_analysis_desc': 'Analisar capturas de tela anexadas',
  'feature.duplicate_detection': 'Detecção de Duplicados',
  'feature.duplicate_detection_desc': 'Encontrar feedbacks existentes similares',
  'feature.smart_routing': 'Roteamento Inteligente',
  'feature.smart_routing_desc': 'Rotear para equipe correta automaticamente',
  'feature.language_detection': 'Detecção de Idioma',
  'feature.language_detection_desc': 'Detectar automaticamente idioma do usuário',

  // Thresholds
  'threshold.min_confidence': 'Confiança Mínima',
  'threshold.min_confidence_desc': 'Confiança mínima para sugestões de IA',
  'threshold.duplicate': 'Limite de Duplicados',
  'threshold.duplicate_desc': 'Pontuação de similaridade para detecção de duplicados',

  // Widget
  'widget.title': 'Enviar feedback',
  'widget.subtitle': 'O que você gostaria de nos dizer?',
  'widget.placeholder': 'Conte-nos o que você está pensando...',
  'widget.attach_screenshot': 'Anexar captura',
  'widget.capturing': 'Capturando página...',
  'widget.capturing_wait': 'Isso pode levar um momento',
  'widget.screenshot_attached': 'Captura anexada',
  'widget.screenshot_preview': 'Visualização da captura',
  'widget.remove_screenshot': 'Remover',
  'widget.send': 'Enviar feedback',
  'widget.sending': 'Enviando...',
  'widget.send_anyway': 'Enviar mesmo assim',
  'widget.irrelevant_title': 'Mensagem não relacionada a este app',
  'widget.irrelevant_message': 'Por favor, envie um feedback relacionado a esta aplicação. Tente descrever um erro, compartilhar uma ideia ou fazer uma pergunta sobre um recurso.',
  'widget.try_again': 'Tentar novamente',
  'widget.cannot_send_irrelevant': 'Não pode enviar - não é relevante',
  'widget.review_type_first': 'Revise o tipo primeiro',
  'widget.not_related': 'Não relacionado à nossa plataforma',
  'widget.thank_you': 'Obrigado!',
  'widget.thank_you_message': 'Seu feedback nos ajuda a melhorar.',
  'widget.powered_by': 'Desenvolvido por Feedback Widget',
  'widget.analyzing': 'Assistente de triagem analisando...',
  'widget.ai_suggestion': 'Sugestão de IA',
  'widget.switch_to': 'Mudar para',
  'widget.keep': 'Manter',
  'widget.possible_duplicate': 'Possível duplicado detectado',
  'widget.view_similar': 'Ver similar',
  'widget.ai_response': 'Resposta da IA',
  'widget.ai_analysis': 'Análise da IA',
  'widget.confidence': 'Confiança',
  'widget.detected_language': 'Idioma detectado',
  'widget.char_count': '{{count}}/1000',
  'widget.type_mismatch_title': 'Incompatibilidade de Tipo Detectada',
  'widget.type_mismatch_desc': 'Isso parece mais um {{suggested}} que um {{current}}',
  'widget.type_mismatch_reason': 'A IA acha que isso é um {{suggested}} porque: {{reason}}',

  // Errors
  'error.capture_failed': 'Não foi possível capturar a tela. Por favor tente novamente.',
  'error.submit_failed': 'Falha ao enviar feedback. Por favor tente novamente.',
  'error.ai_analysis_failed': 'A análise da IA falhou, mas seu feedback foi salvo.',
  'error.connection_failed': 'Falha na conexão. Por favor verifique sua chave de API.',
  'error.invalid_api_key': 'Chave de API inválida. Por favor verifique e tente novamente.',
  'error.rate_limit': 'Limite de taxa excedido. Por favor tente novamente mais tarde.',
  'error.network': 'Erro de rede. Por favor verifique sua conexão.',
  'error.unknown': 'Ocorreu um erro inesperado.',
  'error.not_found': 'Não encontrado.',
  'error.unauthorized': 'Não autorizado. Por favor verifique suas credenciais.',

  // Success
  'success.feedback_submitted': 'Feedback enviado com sucesso!',
  'success.settings_saved': 'Configurações salvas com sucesso!',
  'success.connection_success': 'Conexão bem-sucedida!',
  'success.copied': 'Copiado para a área de transferência!',

  // Home
  'home.title': 'Feedback Widget',
  'home.subtitle': 'Um widget de feedback com IA para triagem inteligente, análise de sentimento e suporte multilíngue',
  'home.try_it': 'Experimente agora!',
  'home.quick_start': 'Início Rápido',
  'home.step_1': 'Clique no botão roxo no canto inferior direito para abrir o widget',
  'home.step_2': 'Selecione seu idioma e tipo de feedback',
  'home.step_3': 'Digite seu feedback - A IA vai analisar em tempo real',
  'home.step_4': 'Vá para [link]Configurações de IA[/link] para adicionar sua própria chave de API para teste',
  'home.feature_ai_title': 'Triagem com IA',
  'home.feature_ai_desc': 'Categorização automática, pontuação de prioridade e análise de sentimento.',
  'home.feature_vision_title': 'Visão com IA',
  'home.feature_vision_desc': 'Captura de tela com análise de problemas de UI por IA.',
  'home.feature_i18n_title': 'Multi-Idioma',
  'home.feature_i18n_desc': 'Detecção automática com tradução. Suporte para EN, ES, PT, ZH.',
  'home.dashboard_title': 'Painel de Admin',
  'home.dashboard_desc': 'Veja feedbacks recebidos com insights de IA e análises',
  'home.settings_title': 'Configurações de IA',
  'home.settings_desc': 'Configure seu provedor de IA (Moonshot/Claude) para teste',
  'home.report_bug': 'Reportar erros',
  'home.share_idea': 'Compartilhar ideias',
  'home.ask_question': 'Fazer perguntas',
  'home.try_it_desc': 'Clique no botão de feedback roxo no canto inferior direito. A IA analisará seu feedback em tempo real e sugerirá a categoria correta, prioridade e até gerará uma resposta!',
  'home.tech_stack': 'Stack Tecnológico',
};
