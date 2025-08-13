// app/api/send-decline-email/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { candidateId, jobId, reason } = await request.json()
    
    const supabase = createClient()

    const { data: candidate } = await supabase
      .from('candidates')
      .select('first_name, last_name, email')
      .eq('id', candidateId)
      .single()

    const { data: job } = await supabase
      .from('jobs')
      .select('title, clients (company_name)')
      .eq('id', jobId)
      .single()

    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #7C3AED; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Application Update</h1>
          <p>TransEra Solutions</p>
        </div>
        <div class="content">
          <h2>Dear ${candidate.first_name},</h2>
          
          <p>Thank you for your interest in the position of <strong>${job.title}</strong> with <strong>${job.clients?.company_name}</strong>.</p>
          
          <p>After careful consideration, we regret to inform you that your application was not successful on this occasion.</p>
          
          ${reason ? `<p>Feedback: ${reason}</p>` : ''}
          
          <p>We will keep your details on file for future opportunities that may match your profile, and we encourage you to apply for other positions that interest you.</p>
          
          <p>Thank you for your time and interest in working with us.</p>
          
          <p>Best regards,<br>
          TransEra Solutions Team</p>
        </div>
        <div class="footer">
          <p>Rosebank | Johannesburg | 2196</p>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: '"TransEra Solutions" <athi@transerasolutions.co.za>',
      to: candidate.email,
      subject: `Application Update - ${job.title}`,
      html: emailTemplate,
    }

    const info = await transporter.sendMail(mailOptions)

    // Log email
    await supabase
      .from('email_automation_log')
      .insert({
        candidate_id: candidateId,
        job_id: jobId,
        email_type: 'decline',
        recipient_email: candidate.email,
        subject: mailOptions.subject,
        email_body: emailTemplate,
        sent_status: 'sent',
        sent_at: new Date().toISOString(),
      })

    return NextResponse.json({ 
      success: true, 
      message: 'Decline email sent successfully' 
    })

  } catch (error) {
    console.error('Error sending decline email:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send decline email' },
      { status: 500 }
    )
  }
}