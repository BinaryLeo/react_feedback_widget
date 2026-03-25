import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix?: string; // Unique prefix per limiter type
  keyGenerator?: (req: Request) => string;
  handler?: (req: Request, res: Response) => void;
}

/**
 * Simple rate limiter middleware
 * Production: Replace with Redis-based solution
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, keyPrefix = 'default', keyGenerator, handler } = options;
  
  // Each limiter instance has its own store
  const store = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting for health checks
    if (req.path === '/health') {
      return next();
    }

    const baseKey = keyGenerator 
      ? keyGenerator(req) 
      : req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    
    // Include prefix to separate different limiter types
    const key = `${keyPrefix}:${baseKey}`;

    const now = Date.now();
    const entry = store.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      store.delete(key);
    }

    const current = store.get(key);
    
    if (!current) {
      // First request in window
      store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (current.count >= max) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);
      
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000));

      if (handler) {
        return handler(req, res);
      }

      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later.',
        retryAfter,
      });
    }

    // Increment count
    current.count++;
    
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000));

    next();
  };
}

// Presets for common use cases
export const createFeedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 feedbacks per window
  keyPrefix: 'feedback',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many feedbacks submitted. Please wait 15 minutes.',
      code: 'RATE_LIMIT_FEEDBACK',
    });
  },
});

export const aiAnalyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 analyses per minute
  keyPrefix: 'ai-analyze',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'AI analysis rate limit exceeded. Please slow down.',
      code: 'RATE_LIMIT_AI',
    });
  },
});

export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  keyPrefix: 'api-key',
});
