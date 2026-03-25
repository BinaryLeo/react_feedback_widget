/**
 * OpenAPI Specification for Feedback Widget API
 * Scalar auto-generated documentation
 */

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Feedback Widget API",
    description: `AI-powered feedback widget API with intelligent triage, sentiment analysis, and multi-language support.

## Features

-  **AI Triage** - Auto-categorization, priority & sentiment analysis
-  **Duplicate Detection** - AI-powered detection of similar feedbacks
-  **Vision AI** - Analyzes attached screenshots
-  **Auto-Response** - Generates helpful AI responses
-  **Smart Routing** - Auto-assigns to teams (dev/design/support)
-  **i18n** - Multi-language support (EN, ES, PT, ZH)

## Authentication

This API does not require authentication for public endpoints. AI configuration endpoints may require admin access.

## AI Configuration

AI features are **completely optional**. The widget works great without AI. To enable AI features, configure your provider (Anthropic or Moonshot) via the admin dashboard or environment variables.`,
    version: "2.0.0",
    contact: {
      name: "Feedback Widget Team",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  tags: [
    { name: "Health", description: "Health check endpoints" },
    { name: "Feedbacks", description: "Feedback management endpoints" },
    { name: "AI", description: "AI configuration and analysis endpoints" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Check if the API is running and healthy",
        operationId: "healthCheck",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                    version: { type: "string", example: "2.0.0" },
                    features: {
                      type: "object",
                      properties: {
                        ai: { type: "boolean" },
                        i18n: { type: "boolean" },
                        analytics: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/feedbacks": {
      get: {
        tags: ["Feedbacks"],
        summary: "List all feedbacks",
        description:
          "Retrieve a list of all feedback entries with optional filtering",
        operationId: "listFeedbacks",
        parameters: [
          {
            name: "type",
            in: "query",
            description: "Filter by feedback type",
            schema: { type: "string", enum: ["BUG", "IDEA", "OTHER"] },
          },
          {
            name: "status",
            in: "query",
            description: "Filter by status",
            schema: {
              type: "string",
              enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"],
            },
          },
          {
            name: "limit",
            in: "query",
            description: "Limit number of results",
            schema: { type: "integer", default: 50 },
          },
        ],
        responses: {
          "200": {
            description: "List of feedbacks retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Feedback" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Feedbacks"],
        summary: "Create new feedback",
        description:
          "Submit a new feedback entry. If AI is enabled, the feedback will be automatically analyzed for type, priority, sentiment, and routing.",
        operationId: "createFeedback",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateFeedbackInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Feedback created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Feedback" },
                    ai: { $ref: "#/components/schemas/AIAnalysis" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid input data",
          },
          "429": {
            description: "Rate limit exceeded",
          },
        },
      },
    },
    "/feedbacks/stats": {
      get: {
        tags: ["Feedbacks"],
        summary: "Get feedback statistics",
        description: "Retrieve aggregated statistics about feedbacks",
        operationId: "getStats",
        responses: {
          "200": {
            description: "Statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/FeedbackStats" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/feedbacks/by-team/{team}": {
      get: {
        tags: ["Feedbacks"],
        summary: "Get feedbacks by team",
        description: "Retrieve feedbacks assigned to a specific team",
        operationId: "getByTeam",
        parameters: [
          {
            name: "team",
            in: "path",
            required: true,
            description: "Team name",
            schema: {
              type: "string",
              enum: ["dev", "design", "product", "support", "security"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Feedbacks retrieved successfully",
          },
        },
      },
    },
    "/feedbacks/by-status/{status}": {
      get: {
        tags: ["Feedbacks"],
        summary: "Get feedbacks by status",
        description: "Retrieve feedbacks filtered by status",
        operationId: "getByStatus",
        parameters: [
          {
            name: "status",
            in: "path",
            required: true,
            description: "Status filter",
            schema: {
              type: "string",
              enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Feedbacks retrieved successfully",
          },
        },
      },
    },
    "/feedbacks/by-priority/{priority}": {
      get: {
        tags: ["Feedbacks"],
        summary: "Get feedbacks by priority",
        description: "Retrieve feedbacks filtered by priority",
        operationId: "getByPriority",
        parameters: [
          {
            name: "priority",
            in: "path",
            required: true,
            description: "Priority filter",
            schema: {
              type: "string",
              enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Feedbacks retrieved successfully",
          },
        },
      },
    },
    "/feedbacks/{id}": {
      get: {
        tags: ["Feedbacks"],
        summary: "Get feedback by ID",
        description: "Retrieve a specific feedback entry by its ID",
        operationId: "getFeedback",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Feedback ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Feedback retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Feedback" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Feedback not found",
          },
        },
      },
    },
    "/feedbacks/{id}/rate": {
      patch: {
        tags: ["Feedbacks"],
        summary: "Rate AI response",
        description: "Rate the AI-generated response for a feedback",
        operationId: "rateFeedback",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Feedback ID",
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rating: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    description: "Rating from 1 to 5",
                  },
                },
                required: ["rating"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Rating submitted successfully",
          },
        },
      },
    },
    "/feedbacks/{id}/ai-response": {
      get: {
        tags: ["Feedbacks", "AI"],
        summary: "Get AI suggested response",
        description: "Get an AI-generated response for a feedback",
        operationId: "getAIResponse",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Feedback ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "AI response generated",
          },
        },
      },
    },
    "/ai/config": {
      get: {
        tags: ["AI"],
        summary: "Get AI configuration",
        description: "Retrieve the current AI configuration",
        operationId: "getAIConfig",
        responses: {
          "200": {
            description: "AI configuration retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/AIConfig" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["AI"],
        summary: "Update AI configuration",
        description: "Update the AI provider and model settings",
        operationId: "updateAIConfig",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAIConfigInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "AI configuration updated",
          },
        },
      },
    },
    "/ai/config/{projectId}": {
      get: {
        tags: ["AI"],
        summary: "Get AI configuration by project",
        description: "Retrieve AI configuration for a specific project",
        operationId: "getAIConfigByProject",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "AI configuration retrieved",
          },
        },
      },
      put: {
        tags: ["AI"],
        summary: "Update AI configuration by project",
        description: "Update AI configuration for a specific project",
        operationId: "updateAIConfigByProject",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAIConfigInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "AI configuration updated",
          },
        },
      },
    },
    "/ai/status": {
      get: {
        tags: ["AI"],
        summary: "Get AI status",
        description: "Check if AI is enabled and configured",
        operationId: "getAIStatus",
        responses: {
          "200": {
            description: "AI status retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    enabled: { type: "boolean" },
                    provider: { type: "string" },
                    model: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/ai/status/{projectId}": {
      get: {
        tags: ["AI"],
        summary: "Get AI status by project",
        description: "Check AI status for a specific project",
        operationId: "getAIStatusByProject",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "AI status retrieved",
          },
        },
      },
    },
    "/ai/test-connection": {
      post: {
        tags: ["AI"],
        summary: "Test AI connection",
        description: "Test the connection to the AI provider",
        operationId: "testAIConnection",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  provider: { type: "string", enum: ["ANTHROPIC", "MOONSHOT"] },
                  apiKey: { type: "string" },
                  model: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Connection test result",
          },
        },
      },
    },
    "/ai/test-analysis": {
      post: {
        tags: ["AI"],
        summary: "Test AI analysis",
        description: "Test AI analysis on sample text",
        operationId: "testAIAnalysis",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  type: { type: "string", enum: ["BUG", "IDEA", "OTHER"] },
                },
                required: ["text"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Analysis result",
          },
        },
      },
    },
    "/ai/analyze": {
      post: {
        tags: ["AI"],
        summary: "Analyze feedback text",
        description: "Real-time pre-submission analysis of feedback text",
        operationId: "analyzeFeedback",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  type: { type: "string", enum: ["BUG", "IDEA", "OTHER"] },
                },
                required: ["text"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Analysis completed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AIAnalysis" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Feedback: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["BUG", "IDEA", "OTHER"] },
          comment: { type: "string" },
          screenshot: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"],
          },
          priority: {
            type: "string",
            enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
          },
          team: {
            type: "string",
            enum: ["dev", "design", "product", "support", "security"],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateFeedbackInput: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["BUG", "IDEA", "OTHER"],
            description: "Type of feedback",
          },
          comment: {
            type: "string",
            minLength: 3,
            description: "Feedback comment",
          },
          screenshot: {
            type: "string",
            nullable: true,
            description: "Base64 encoded screenshot",
          },
          language: {
            type: "string",
            default: "en",
            description: "User language (en, es, pt-BR, zh)",
          },
          projectId: {
            type: "string",
            nullable: true,
            description: "Optional project ID",
          },
        },
        required: ["type", "comment"],
      },
      AIAnalysis: {
        type: "object",
        properties: {
          analyzed: { type: "boolean" },
          suggestedType: { type: "string", enum: ["BUG", "IDEA", "OTHER"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          priority: {
            type: "string",
            enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
          },
          sentiment: {
            type: "string",
            enum: ["FRUSTRATED", "HAPPY", "NEUTRAL", "ANGRY", "CONFUSED"],
          },
          category: { type: "string" },
          summary: { type: "string" },
          actionItems: { type: "array", items: { type: "string" } },
          language: { type: "string" },
          suggestedResponse: { type: "string" },
          typeSuggestion: {
            type: "object",
            properties: {
              currentType: { type: "string" },
              suggestedType: { type: "string" },
              reason: { type: "string" },
              confidence: { type: "number" },
            },
          },
          isDuplicate: { type: "boolean" },
          similarFeedbacks: { type: "array" },
          team: {
            type: "string",
            enum: ["dev", "design", "product", "support", "security"],
          },
        },
      },
      AIConfig: {
        type: "object",
        properties: {
          provider: { type: "string", enum: ["ANTHROPIC", "MOONSHOT", "NONE"] },
          model: { type: "string" },
          enabled: { type: "boolean" },
          features: {
            type: "object",
            properties: {
              autoCategorize: { type: "boolean" },
              validateType: { type: "boolean" },
              priorityScoring: { type: "boolean" },
              sentimentAnalysis: { type: "boolean" },
              autoResponse: { type: "boolean" },
              screenshotAnalysis: { type: "boolean" },
              duplicateDetection: { type: "boolean" },
              smartRouting: { type: "boolean" },
              languageDetection: { type: "boolean" },
            },
          },
        },
      },
      UpdateAIConfigInput: {
        type: "object",
        properties: {
          provider: { type: "string", enum: ["ANTHROPIC", "MOONSHOT", "NONE"] },
          apiKey: { type: "string" },
          model: { type: "string" },
          enabled: { type: "boolean" },
          features: { type: "object" },
          thresholds: { type: "object" },
        },
      },
      FeedbackStats: {
        type: "object",
        properties: {
          total: { type: "integer" },
          byType: {
            type: "object",
            properties: {
              BUG: { type: "integer" },
              IDEA: { type: "integer" },
              OTHER: { type: "integer" },
            },
          },
          byStatus: {
            type: "object",
            properties: {
              PENDING: { type: "integer" },
              IN_PROGRESS: { type: "integer" },
              RESOLVED: { type: "integer" },
              CLOSED: { type: "integer" },
            },
          },
          byPriority: {
            type: "object",
            properties: {
              CRITICAL: { type: "integer" },
              HIGH: { type: "integer" },
              MEDIUM: { type: "integer" },
              LOW: { type: "integer" },
            },
          },
        },
      },
    },
  },
};
