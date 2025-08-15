// Update your lib/supabase/client.ts - ENHANCE don't replace
export function createClient() {
  // Keep your existing code, just add these new methods
  
  const validateData = (data: any, table: string) => {
    // Add validation based on table
    if (table === 'candidates') {
      if (!data.email || !data.name) {
        throw new Error('Email and name are required')
      }
      // Add workflow stage from your PDF
      data.stage = data.stage || 'sourced' // sourced, prescreened, interviewed, placed
      data.consultant = data.consultant || null // Lillian, Athi, Thembeka
    }
    
    if (table === 'jobs') {
      data.workflow_stage = data.workflow_stage || 'received' // received, briefing_scheduled, posted, sourcing
      data.allocated_to = data.allocated_to || null
    }
    
    return data
  }

  return {
    from: (table: string) => ({
      select: async (columns?: string) => {
        try {
          const data = JSON.parse(localStorage.getItem(table) || '[]')
          
          // Add filtering support
          return {
            data,
            count: data.length,
            error: null,
            eq: (column: string, value: any) => {
              const filtered = data.filter((item: any) => item[column] === value)
              return { data: filtered, count: filtered.length, error: null }
            },
            contains: (column: string, value: string) => {
              const filtered = data.filter((item: any) => 
                item[column]?.toLowerCase().includes(value.toLowerCase())
              )
              return { data: filtered, count: filtered.length, error: null }
            }
          }
        } catch (error) {
          return { data: [], count: 0, error }
        }
      },
      
      insert: async (data: any) => {
        try {
          const validated = validateData(data, table)
          validated.id = validated.id || Date.now().toString()
          validated.created_at = new Date().toISOString()
          
          const existing = JSON.parse(localStorage.getItem(table) || '[]')
          existing.push(validated)
          localStorage.setItem(table, JSON.stringify(existing))
          
          // Add to activity log
          const activities = JSON.parse(localStorage.getItem('activities') || '[]')
          activities.push({
            action: `Created ${table.slice(0, -1)}`,
            table,
            id: validated.id,
            user: JSON.parse(localStorage.getItem('auth_user') || '{}').name,
            timestamp: new Date().toISOString()
          })
          localStorage.setItem('activities', JSON.stringify(activities))
          
          return { data: validated, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      
      update: async (updates: any) => {
        return {
          eq: (column: string, value: any) => {
            try {
              const data = JSON.parse(localStorage.getItem(table) || '[]')
              const index = data.findIndex((item: any) => item[column] === value)
              
              if (index !== -1) {
                data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() }
                localStorage.setItem(table, JSON.stringify(data))
                
                // Log the update
                const activities = JSON.parse(localStorage.getItem('activities') || '[]')
                activities.push({
                  action: `Updated ${table.slice(0, -1)}`,
                  table,
                  id: data[index].id,
                  changes: updates,
                  user: JSON.parse(localStorage.getItem('auth_user') || '{}').name,
                  timestamp: new Date().toISOString()
                })
                localStorage.setItem('activities', JSON.stringify(activities))
                
                return { data: data[index], error: null }
              }
              
              return { data: null, error: new Error('Not found') }
            } catch (error) {
              return { data: null, error }
            }
          }
        }
      }
    })
  }
}