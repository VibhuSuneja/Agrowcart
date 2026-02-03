/**
 * Rate Limiter for API Routes
 * Implements sliding window rate limiting using in-memory Map
 * 
 * Usage:
 * import { rateLimit, RateLimitConfig } from '@/lib/rateLimit'
 * 
 * const config: RateLimitConfig = { limit: 5, windowMs: 60000 }
 * const limiter = rateLimit(config)
 * 
 * In your API route:
 * const result = limiter.check(identifier)
 * if (!result.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
 */

export interface RateLimitConfig {
    limit: number;        // Max requests allowed
    windowMs: number;     // Time window in milliseconds
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (resets on server restart - acceptable for Next.js serverless)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}

export function rateLimit(config: RateLimitConfig) {
    return {
        check: (identifier: string): { success: boolean; remaining: number; resetIn: number } => {
            cleanup();

            const now = Date.now();
            const key = identifier;
            const entry = rateLimitStore.get(key);

            // If no entry or window expired, create new entry
            if (!entry || entry.resetTime < now) {
                rateLimitStore.set(key, {
                    count: 1,
                    resetTime: now + config.windowMs
                });
                return { success: true, remaining: config.limit - 1, resetIn: config.windowMs };
            }

            // If within window and under limit, increment
            if (entry.count < config.limit) {
                entry.count++;
                rateLimitStore.set(key, entry);
                return {
                    success: true,
                    remaining: config.limit - entry.count,
                    resetIn: entry.resetTime - now
                };
            }

            // Rate limited
            return {
                success: false,
                remaining: 0,
                resetIn: entry.resetTime - now
            };
        }
    };
}

// Pre-configured rate limiters for different endpoints
export const authRateLimit = rateLimit({ limit: 5, windowMs: 60 * 1000 });      // 5 per minute
export const paymentRateLimit = rateLimit({ limit: 3, windowMs: 60 * 1000 });   // 3 per minute  
export const aiRateLimit = rateLimit({ limit: 10, windowMs: 60 * 1000 });       // 10 per minute
export const generalRateLimit = rateLimit({ limit: 30, windowMs: 60 * 1000 });  // 30 per minute

/**
 * Helper to get client identifier from request
 * Uses IP address or falls back to a random identifier
 */
export function getClientIdentifier(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    return ip;
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(resetIn: number) {
    return new Response(
        JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil(resetIn / 1000)
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil(resetIn / 1000))
            }
        }
    );
}
