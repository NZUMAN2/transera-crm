// lib/xero/client.ts
import { XeroApi, AccountingApi } from 'xero-node'

export class XeroClient {
  private xero: XeroApi
  private accountingApi: AccountingApi

  constructor() {
    this.xero = new XeroApi({
      clientId: process.env.XERO_CLIENT_ID!,
      clientSecret: process.env.XERO_CLIENT_SECRET!,
      redirectUris: [`${process.env.NEXTAUTH_URL}/api/xero/callback`],
      scopes: ['accounting.transactions', 'accounting.contacts']
    })
    this.accountingApi = new AccountingApi(this.xero)
  }

  async getAuthUrl() {
    return await this.xero.buildConsentUrl()
  }

  async exchangeCodeForToken(code: string) {
    return await this.xero.apiCallback(code)
  }

  async createContact(client: any) {
    try {
      const contact = {
        name: client.company_name,
        emailAddress: client.contact_email,
        phones: [{
          phoneType: 'DEFAULT',
          phoneNumber: client.contact_phone
        }],
        addresses: [{
          addressType: 'STREET',
          addressLine1: client.address,
          country: 'South Africa'
        }]
      }

      const response = await this.accountingApi.createContacts(
        this.getTenantId(),
        { contacts: [contact] }
      )

      return response.body.contacts?.[0]
    } catch (error) {
      console.error('Error creating Xero contact:', error)
      throw error
    }
  }

  async createQuotation(placementData: any) {
    try {
      const lineItems = [{
        description: `Recruitment Services - ${placementData.position}`,
        quantity: 1,
        unitAmount: placementData.fee,
        accountCode: '200', // Sales account code
        taxType: 'OUTPUT2' // 15% VAT in South Africa
      }]

      const quote = {
        type: 'ACCREC',
        contact: { contactID: placementData.xero_contact_id },
        date: new Date().toISOString().split('T')[0],
        dueDate: this.addDays(new Date(), 30).toISOString().split('T')[0],
        lineItems: lineItems,
        reference: `TES-${placementData.job_code}`,
        status: 'DRAFT'
      }

      const response = await this.accountingApi.createInvoices(
        this.getTenantId(),
        { invoices: [quote] }
      )

      return response.body.invoices?.[0]
    } catch (error) {
      console.error('Error creating Xero quotation:', error)
      throw error
    }
  }

  async createInvoice(placementData: any, poNumber?: string) {
    try {
      const lineItems = [{
        description: `Recruitment Services - ${placementData.position}\nCandidate: ${placementData.candidate_name}`,
        quantity: 1,
        unitAmount: placementData.fee,
        accountCode: '200',
        taxType: 'OUTPUT2'
      }]

      const invoice = {
        type: 'ACCREC',
        contact: { contactID: placementData.xero_contact_id },
        date: new Date().toISOString().split('T')[0],
        dueDate: this.addDays(new Date(), 30).toISOString().split('T')[0],
        lineItems: lineItems,
        reference: `TES-${placementData.job_code}`,
        purchaseOrderNumber: poNumber,
        status: 'AUTHORISED'
      }

      const response = await this.accountingApi.createInvoices(
        this.getTenantId(),
        { invoices: [invoice] }
      )

      return response.body.invoices?.[0]
    } catch (error) {
      console.error('Error creating Xero invoice:', error)
      throw error
    }
  }

  private getTenantId(): string {
    // This would be stored after OAuth authentication
    return process.env.XERO_TENANT_ID!
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}

// app/api/xero/auth/route.ts
import { NextResponse } from 'next/server'
import { XeroClient } from '@/lib/xero/client'

export async function GET() {
  try {
    const xero = new XeroClient()
    const authUrl = await xero.getAuthUrl()
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Xero auth error:', error)
    return NextResponse.json({ error: 'Failed to initialize Xero auth' }, { status: 500 })
  }
}

// app/api/xero/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { XeroClient } from '@/lib/xero/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      throw new Error('No authorization code received')
    }

    const xero = new XeroClient()
    const tokenResponse = await xero.exchangeCodeForToken(code)
    
    // Store tokens securely (implement proper token storage)
    const supabase = createClient()
    await supabase
      .from('xero_tokens')
      .upsert({
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000)
      })

    return NextResponse.redirect('/dashboard?xero=connected')
  } catch (error) {
    console.error('Xero callback error:', error)
    return NextResponse.redirect('/dashboard?xero=error')
  }
}

// app/api/xero/create-quotation/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { XeroClient } from '@/lib/xero/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { clientId, jobId, candidateId, fee } = await request.json()
    
    const supabase = createClient()
    
    // Get placement details
    const { data: placementData } = await supabase
      .from('jobs')
      .select(`
        title, job_code,
        clients (company_name, contact_name, xero_contact_id),
        candidates (first_name, last_name)
      `)
      .eq('id', jobId)
      .single()

    if (!placementData) {
      throw new Error('Job not found')
    }

    const xero = new XeroClient()
    
    // Create Xero contact if not exists
    let xeroContactId = placementData.clients.xero_contact_id
    if (!xeroContactId) {
      const contact = await xero.createContact(placementData.clients)
      xeroContactId = contact.contactID
      
      // Update client with Xero contact ID
      await supabase
        .from('clients')
        .update({ xero_contact_id: xeroContactId })
        .eq('id', clientId)
    }

    // Create quotation
    const quotation = await xero.createQuotation({
      xero_contact_id: xeroContactId,
      position: placementData.title,
      job_code: placementData.job_code,
      fee: fee,
      candidate_name: `${placementData.candidates.first_name} ${placementData.candidates.last_name}`
    })

    // Log in database
    await supabase
      .from('xero_integration')
      .insert({
        client_id: clientId,
        job_id: jobId,
        candidate_id: candidateId,
        transaction_type: 'quotation',
        xero_invoice_id: quotation.invoiceID,
        amount: fee,
        quotation_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        xero_status: 'synced'
      })

    return NextResponse.json({ 
      success: true, 
      quotationId: quotation.invoiceID,
      quotationNumber: quotation.invoiceNumber
    })

  } catch (error) {
    console.error('Error creating Xero quotation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create quotation' },
      { status: 500 }
    )
  }
}

// app/api/xero/create-invoice/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { XeroClient } from '@/lib/xero/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { quotationId, poNumber } = await request.json()
    
    const supabase = createClient()
    
    // Get quotation details
    const { data: quotationData } = await supabase
      .from('xero_integration')
      .select(`
        *,
        jobs (title, job_code),
        clients (company_name, xero_contact_id),
        candidates (first_name, last_name)
      `)
      .eq('id', quotationId)
      .single()

    if (!quotationData) {
      throw new Error('Quotation not found')
    }

    const xero = new XeroClient()
    
    // Create invoice
    const invoice = await xero.createInvoice({
      xero_contact_id: quotationData.clients.xero_contact_id,
      position: quotationData.jobs.title,
      job_code: quotationData.jobs.job_code,
      fee: quotationData.amount,
      candidate_name: `${quotationData.candidates.first_name} ${quotationData.candidates.last_name}`
    }, poNumber)

    // Update database
    await supabase
      .from('xero_integration')
      .update({
        transaction_type: 'invoice',
        po_number: poNumber,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'sent',
        xero_status: 'synced'
      })
      .eq('id', quotationId)

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.invoiceID,
      invoiceNumber: invoice.invoiceNumber
    })

  } catch (error) {
    console.error('Error creating Xero invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}

// Environment variables needed in .env.local
/*
# Xero API Configuration
XERO_CLIENT_ID=your_xero_client_id
XERO_CLIENT_SECRET=your_xero_client_secret
XERO_TENANT_ID=your_tenant_id_after_auth

# Email Configuration (for automated emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=athi@transerasolutions.co.za
EMAIL_PASS=your_app_password
*/