// app/(dashboard)/email/page.tsx

import { createClient } from '@/lib/supabase/server'

export default async function EmailPage() {
  const supabase = createClient()

  // Get email templates
  const { data: templates } = await supabase
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Email Inbox</h1>
        <p className="text-gray-600 mt-1">Manage email templates and communications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Email Tabs */}
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button className="py-3 border-b-2 border-purple-600 text-purple-600 font-medium">
              All Mail
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-700">
              Candidates
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-700">
              Clients
            </button>
            <button className="py-3 text-gray-500 hover:text-gray-700">
              Unread
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-4 border-b flex justify-end space-x-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            🔄 Refresh
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            ✏️ Compose
          </button>
        </div>

        {/* Email List */}
        <div className="divide-y">
          <div className="p-6 text-center text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No emails found</p>
            <p className="text-sm mt-2">Email integration coming soon</p>
          </div>
        </div>

        {/* Templates Section */}
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates?.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                <div className="mt-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {template.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}