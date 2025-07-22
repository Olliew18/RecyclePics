import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
// In production, use Redis for distributed rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per window

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();

  // Get or create client record
  let clientRecord = requestCounts.get(clientId);
  
  if (!clientRecord || now > clientRecord.resetTime) {
    // Reset window
    clientRecord = {
      count: 0,
      resetTime: now + WINDOW_MS
    };
  }

  // Check if limit exceeded
  if (clientRecord.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000)
    });
  }

  // Increment count
  clientRecord.count++;
  requestCounts.set(clientId, clientRecord);

  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': (MAX_REQUESTS - clientRecord.count).toString(),
    'X-RateLimit-Reset': new Date(clientRecord.resetTime).toISOString()
  });

  next();
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [clientId, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(clientId);
    }
  }
}, WINDOW_MS);