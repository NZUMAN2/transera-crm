import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const supabase = createClient()
  
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your client companies and contacts</p>
        </div>
        <Link 
          href="/clients/new"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add New Client
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Total Clients</div>
          <div className="text-2xl font-bold">{clients?.length || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Active Clients</div>
          <div className="text-2xl font-bold text-green-600">
            {clients?.filter(c => c.status === 'active').length || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Prospects</div>
          <div className="text-2xl font-bold text-yellow-600">
            {clients?.filter(c => c.status === 'prospect').length || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Total Jobs</div>
          <div className="text-2xl font-bold text-purple-600">0</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients?.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{client.company_name}</div>
                </td>
                <td className="px-6 py-4 text-sm">{client.industry}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">{client.contact_name}</div>
                  <div className="text-xs text-gray-500">{client.contact_email}</div>
                </td>
                <td className="px-6 py-4 text-sm">{client.company_size}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' :
                    client.status === 'prospect' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">0</td>
                <td className="px-6 py-4 text-sm">{client.account_manager || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <Link href={`/clients/${client.id}`} className="text-purple-600 hover:text-purple-900">
                      View
                    </Link>
                    <Link href={`/clients/${client.id}/edit`} className="text-purple-600 hover:text-purple-900">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}