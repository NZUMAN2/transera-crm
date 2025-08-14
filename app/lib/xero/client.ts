// Mock Supabase client that uses localStorage
export function createClient() {
  return {
    from: (table: string) => ({
      select: async () => {
        try {
          const data = JSON.parse(localStorage.getItem(table) || '[]')
          return { data, count: data.length, error: null }
        } catch {
          return { data: [], count: 0, error: null }
        }
      },
      insert: async (data: any) => {
        try {
          const existing = JSON.parse(localStorage.getItem(table) || '[]')
          existing.push(data)
          localStorage.setItem(table, JSON.stringify(existing))
          return { data, error: null }
        } catch (error) {
          return { data: null, error }
        }
      }
    })
  }
}