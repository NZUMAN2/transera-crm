// app/(dashboard)/clients/actions.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientCompany(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const clientData = {
    organization_id: profile?.organization_id,
    company_name: formData.get('company_name') as string,
    industry: formData.get('industry') as string,
    website: formData.get('website') as string,
    company_size: formData.get('company_size') as string,
    annual_revenue: formData.get('annual_revenue') as string,
    primary_contact_name: formData.get('primary_contact_name') as string,
    primary_contact_email: formData.get('primary_contact_email') as string,
    primary_contact_phone: formData.get('primary_contact_phone') as string,
    primary_contact_position: formData.get('primary_contact_position') as string,
    billing_address: formData.get('billing_address') as string,
    notes: formData.get('notes') as string,
    status: formData.get('status') as string || 'prospect',
    created_by: user.id,
    account_manager: formData.get('account_manager') as string || user.id
  }

  const { error } = await supabase
    .from('clients')
    .insert(clientData)

  if (error) {
    console.error('Error creating client:', error)
    throw new Error('Failed to create client')
  }

  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClientCompany(clientId: string, formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const clientData = {
    company_name: formData.get('company_name') as string,
    industry: formData.get('industry') as string,
    website: formData.get('website') as string,
    company_size: formData.get('company_size') as string,
    annual_revenue: formData.get('annual_revenue') as string,
    primary_contact_name: formData.get('primary_contact_name') as string,
    primary_contact_email: formData.get('primary_contact_email') as string,
    primary_contact_phone: formData.get('primary_contact_phone') as string,
    primary_contact_position: formData.get('primary_contact_position') as string,
    billing_address: formData.get('billing_address') as string,
    notes: formData.get('notes') as string,
    status: formData.get('status') as string,
    account_manager: formData.get('account_manager') as string
  }

  const { error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', clientId)

  if (error) {
    console.error('Error updating client:', error)
    throw new Error('Failed to update client')
  }

  revalidatePath('/clients')
  revalidatePath(`/clients/${clientId}`)
  redirect('/clients')
}

export async function deleteClientCompany(clientId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)

  if (error) {
    console.error('Error deleting client:', error)
    throw new Error('Failed to delete client')
  }

  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClientStatus(clientId: string, status: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('clients')
    .update({ status })
    .eq('id', clientId)

  if (error) {
    console.error('Error updating client status:', error)
    throw new Error('Failed to update client status')
  }

  revalidatePath('/clients')
  revalidatePath(`/clients/${clientId}`)
}