// app/debug/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .single()

  // Try to get jobs without RLS
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')

  // Try to get candidates
  const { data: candidates, error: candidatesError } = await supabase
    .from('candidates')
    .select('*')

  // Try to get clients
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('*')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      
      <div className="space-y-6">
        {/* Auth User */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Auth User</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
          </pre>
        </div>

        {/* User Profile */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Profile in Database</h2>
          {profileError ? (
            <div className="bg-red-50 p-4 rounded">
              <p className="text-red-600">Error: {profileError.message}</p>
              <p className="text-sm text-red-500 mt-2">User profile not found - this is the problem!</p>
            </div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </div>

        {/* Organization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Organization</h2>
          {orgError ? (
            <p className="text-red-600">Error: {orgError.message}</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(org, null, 2)}
            </pre>
          )}
        </div>

        {/* Data Counts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Data Access Check</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Jobs</p>
              <p>Count: {jobs?.length || 0}</p>
              {jobsError && <p className="text-red-500 text-sm">Error: {jobsError.message}</p>}
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Candidates</p>
              <p>Count: {candidates?.length || 0}</p>
              {candidatesError && <p className="text-red-500 text-sm">Error: {candidatesError.message}</p>}
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">Clients</p>
              <p>Count: {clients?.length || 0}</p>
              {clientsError && <p className="text-red-500 text-sm">Error: {clientsError.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}