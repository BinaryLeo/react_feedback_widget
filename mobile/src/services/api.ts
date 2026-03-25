import axios from 'axios';
import { Platform } from 'react-native';
import type {
  FeedbackData,
  FeedbackResponse,
  AIConfig,
  AIConfigResponse,
  TestConnectionResponse,
  AIAnalysis,
  FeedbackWithAI,
  FeedbackStats,
  GuardrailConfig,
  AIStatusResponse,
} from '../types';

// Configure API URL based on platform
// iOS Simulator: use 127.0.0.1 (localhost sometimes doesn't work)
// Android Emulator: use 10.0.2.2
// Physical device: use your machine's IP address (e.g., 192.168.1.x)
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3333'; // Android Emulator
  }
  // For iOS Simulator, use 127.0.0.1 instead of localhost
  // If using physical device, change to your machine's IP: 'http://192.168.x.x:3333'
  return 'http://127.0.0.1:3333';
};

const API_URL = getApiUrl();
console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 seconds for faster error feedback
});

// Feedback API
export const feedbackService = {
  async createFeedback(data: FeedbackData): Promise<FeedbackResponse> {
    try {
      // Use 30s timeout for AI analysis
      const response = await api.post('/feedbacks', data, { timeout: 30000 });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            error: 'Request timeout - please try again',
          };
        }
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to send feedback',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async listFeedbacks(): Promise<{ success: boolean; data?: FeedbackWithAI[]; error?: string }> {
    try {
      const response = await api.get('/feedbacks');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to fetch feedbacks',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async getStats(): Promise<{ success: boolean; data?: FeedbackStats; error?: string }> {
    try {
      console.log('Making request to /feedbacks/stats');
      const response = await api.get('/feedbacks/stats');
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
        return {
          success: false,
          error: error.message || 'Failed to fetch stats',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  // Alias for DashboardScreen compatibility
  async getFeedbackStats(): Promise<FeedbackStats> {
    console.log('Fetching stats from:', API_URL);
    const result = await this.getStats();
    console.log('Stats result:', result);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch stats');
    }
    return result.data;
  },

  async rateFeedback(
    id: string,
    rating: 'POSITIVE' | 'NEGATIVE',
    ratingNote?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.patch(`/feedbacks/${id}/rate`, { rating, ratingNote });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to rate feedback',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async updateStatus(
    id: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED',
    note?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.patch(`/feedbacks/${id}/status`, { status, note });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to update status',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async updateType(
    id: string,
    type: 'BUG' | 'IDEA' | 'OTHER' | 'HELP' | 'PRAISE' | 'QUESTION'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.patch(`/feedbacks/${id}/type`, { type });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to update type',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },
};

// AI API
export const aiService = {
  async getConfig(): Promise<AIConfigResponse> {
    try {
      const response = await api.get('/ai/config');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to fetch AI config',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async getFullConfig(): Promise<AIConfigResponse> {
    try {
      const response = await api.get('/ai/config/full');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to fetch AI config',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async updateConfig(config: AIConfig): Promise<AIConfigResponse> {
    try {
      const response = await api.put('/ai/config', config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to update AI config',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async testConnection(
    provider: string,
    apiKey: string,
    model: string,
    baseUrl?: string
  ): Promise<TestConnectionResponse> {
    try {
      const response = await api.post('/ai/test-connection', {
        provider,
        apiKey,
        model,
        baseUrl,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Connection failed',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async analyzeFeedback(
    message: string,
    type: string,
    provider?: string,
    apiKey?: string,
    model?: string
  ): Promise<{ success: boolean; data?: AIAnalysis; error?: string }> {
    try {
      const response = await api.post('/ai/analyze', {
        message,
        type,
        provider,
        apiKey,
        model,
      }, {
        timeout: 30000, // 30 seconds for AI analysis
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            error: 'Analysis timeout - please try again',
          };
        }
        return {
          success: false,
          error: error.response?.data?.error || 'Analysis failed',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async getStatus(): Promise<AIStatusResponse> {
    try {
      const response = await api.get('/ai/status');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to get AI status',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async updateGuardrail(config: GuardrailConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.put('/ai/guardrail', config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to update guardrail',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },
};

export default api;
