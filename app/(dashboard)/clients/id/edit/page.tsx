// app/(dashboard)/clients/[id]/edit/page.tsx

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { updateClientCompany } from '../../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditClientPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createClient()
  
  // Get client details
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !client) {
    notFound()
  }

  // Get users for account manager dropdown
  const { data: users } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('is_active', true)
    .order('full_name')

  const updateClientWithId = updateClientCompany.bind(null, client.id)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
        <p className="text-gray-600 mt-1">Update client information</p>
      </div>

      <form action={updateClientWithId} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Company Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input 
                  id="company_name"
                  name="company_name"
                  required
                  defaultValue={client.company_name}
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  name="industry"
                  defaultValue={client.industry || ''}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Legal">Legal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={client.website || ''}
                />
              </div>

              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <select
                  id="company_size"
                  name="company_size"
                  defaultValue={client.company_size || ''}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <Label htmlFor="annual_revenue">Annual Revenue</Label>
                <select
                  id="annual_revenue"
                  name="annual_revenue"
                  defaultValue={client.annual_revenue || ''}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select revenue</option>
                  <option value="< R1M">&lt; R1M</option>
                  <option value="R1M - R10M">R1M - R10M</option>
                  <option value="R10M - R50M">R10M - R50M</option>
                  <option value="R50M - R100M">R50M - R100M</option>
                  <option value="R100M - R500M">R100M - R500M</option>
                  <option value="R500M+">R500M+</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={client.status}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Primary Contact */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_contact_name">Contact Name</Label>
                <Input 
                  id="primary_contact_name"
                  name="primary_contact_name"
                  defaultValue={client.primary_contact_name || ''}
                />
              </div>
              
              <div>
                <Label htmlFor="primary_contact_position">Position</Label>
                <Input 
                  id="primary_contact_position"
                  name="primary_contact_position"
                  defaultValue={client.primary_contact_position || ''}
                />
              </div>

              <div>
                <Label htmlFor="primary_contact_email">Email</Label>
                <Input 
                  id="primary_contact_email"
                  name="primary_contact_email"
                  type="email"
                  defaultValue={client.primary_contact_email || ''}
                />
              </div>

              <div>
                <Label htmlFor="primary_contact_phone">Phone</Label>
                <Input 
                  id="primary_contact_phone"
                  name="primary_contact_phone"
                  defaultValue={client.primary_contact_phone || ''}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="billing_address">Billing Address</Label>
                <textarea
                  id="billing_address"
                  name="billing_address"
                  rows={3}
                  defaultValue={client.billing_address || ''}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <Label htmlFor="account_manager">Account Manager</Label>
                <select
                  id="account_manager"
                  name="account_manager"
                  defaultValue={client.account_manager || ''}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Assign account manager</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  defaultValue={client.notes || ''}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link href={`/clients/${client.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">
              Update Client
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}