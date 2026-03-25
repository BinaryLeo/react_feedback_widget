import { AIProviderBase } from './providers/base';
import { MoonshotProvider } from './providers/moonshot';
import { AnthropicProvider } from './providers/anthropic';
import { AIConfig } from './types';

export class AIProviderFactory {
  static createProvider(config: AIConfig): AIProviderBase | null {
    if (!config.enabled || !config.apiKey) {
      return null;
    }

    switch (config.provider) {
      case 'MOONSHOT':
        return new MoonshotProvider(config);
      case 'ANTHROPIC':
        return new AnthropicProvider(config);
      case 'OPENAI':
        // OpenAI provider can be added here
        throw new Error('OpenAI provider not yet implemented');
      case 'NONE':
      default:
        return null;
    }
  }
}
