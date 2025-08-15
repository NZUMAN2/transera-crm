export class AuditLogger {
  static log(action: {
    userId: string
    action: string
    entity: string
    entityId?: string
    metadata?: any
    ipAddress?: string
    userAgent?: string
  }): void {
    const logEntry = {
      ...action,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    }
    
    // In production, send to logging service (e.g., Datadog, Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Send to external logging service
      fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      })
    }
    
    // For now, store in secure storage
    const logs = SecureStorage.getItem('audit_logs') || []
    logs.push(logEntry)
    
    // Keep only last 1000 logs in memory
    if (logs.length > 1000) {
      logs.shift()
    }
    
    SecureStorage.setItem('audit_logs', logs, 1440) // 24 hours
  }
  
  // Log security events
  static logSecurityEvent(event: {
    type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access'
    userId?: string
    details: any
  }): void {
    this.log({
      userId: event.userId || 'anonymous',
      action: event.type,
      entity: 'security',
      metadata: event.details
    })
  }
}