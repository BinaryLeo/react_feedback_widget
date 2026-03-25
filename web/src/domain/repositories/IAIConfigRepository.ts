export interface AIProviderConfig {
  provider: 'ANTHROPIC' | 'MOONSHOT' | 'NONE';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface IAIConfigRepository {
  getStatus(): Promise<{ enabled: boolean; provider?: string; model?: string }>;
  testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }>;
  analyze(message: string, type: string, config: AIProviderConfig): Promise<any>;
}
