// Mock Supabase client that prevents all errors
export function createClient() {
  return {
    auth: {
      getUser: async () => ({ 
        data: { 
          user: {
            id: 'mock-user-id',
            email: 'user@transera.com',
            created_at: new Date().toISOString()
          } 
        },
        error: null 
      }),
      signOut: async () => ({ error: null }),
      signIn: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } }
      })
    },
    from: (table: string) => ({
      select: async () => ({ data: [], count: 0, error: null }),
      insert: async (data: any) => ({ data, error: null }),
      update: async (data: any) => ({ data, error: null }),
      delete: async () => ({ data: null, error: null }),
      upsert: async (data: any) => ({ data, error: null })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null })
      })
    }
  }
}

// Export as default too for compatibility
export default createClient