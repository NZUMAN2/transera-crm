import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
  interval: number
  uniqueTokenPerInterval?: number
}

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>
  private interval: number
  private maxTokens: number

  constructor(options: RateLimitOptions) {
    this.interval = options.interval
    this.maxTokens = options.uniqueTokenPerInterval || 500
    this.tokenCache = new LRUCache<string, number[]>({
      max: this.maxTokens,
      ttl: this.interval
    })
  }

  async check(limit: number, token: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now()
    const tokenCount = this.tokenCache.get(token) || []
    const validTokens = tokenCount.filter(timestamp => now - timestamp < this.interval)
    
    if (validTokens.length >= limit) {
      return { success: false, remaining: 0 }
    }
    
    validTokens.push(now)
    this.tokenCache.set(token, validTokens)
    
    return { success: true, remaining: limit - validTokens.length }
  }
}

// Create rate limiters for different endpoints
export const rateLimiters = {
  api: new RateLimiter({ interval: 60000, uniqueTokenPerInterval: 1000 }), // 1 minute
  auth: new RateLimiter({ interval: 900000, uniqueTokenPerInterval: 100 }), // 15 minutes
  upload: new RateLimiter({ interval: 3600000, uniqueTokenPerInterval: 50 }) // 1 hour
}