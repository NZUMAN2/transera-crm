// app/(dashboard)/clients/new/page.tsx

import { createClient } from '@/lib/supabase/server'
import { createClientCompany } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewClientPage() {
  const supabase = createClient()
  
  // Get users for account manager dropdown
  const { data: users } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('is_active', true)
    .order('full_name');

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
        <p className="text-gray-600 mt-1">Create a new client company profile</p>
      </div>

      <form action={createClientCompany} className="max-w-4xl">
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
                  placeholder="Tech Solutions Inc."
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  name="industry"
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
                  placeholder="https://www.example.com"
                />
              </div>

              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <select
                  id="company_size"
                  name="company_size"
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
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <Label htmlFor="primary_contact_position">Position</Label>
                <Input 
                  id="primary_contact_position"
                  name="primary_contact_position"
                  placeholder="HR Manager"
                />
              </div>

              <div>
                <Label htmlFor="primary_contact_email">Email</Label>
                <Input 
                  id="primary_contact_email"
                  name="primary_contact_email"
                  type="email"
                  placeholder="john.smith@example.com"
                />
              </div>

              <div>
                <Label htmlFor="primary_contact_phone">Phone</Label>
                <Input 
                  id="primary_contact_phone"
                  name="primary_contact_phone"
                  placeholder="+27 11 234 5678"
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
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="123 Business Street&#10;Sandton&#10;Johannesburg, 2196"
                />
              </div>

              <div>
                <Label htmlFor="account_manager">Account Manager</Label>
                <select
                  id="account_manager"
                  name="account_manager"
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
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Additional notes about this client..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link href="/clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">
              Create Client
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}