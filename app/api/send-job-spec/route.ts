// app/api/send-job-spec/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { candidateId, jobId, candidateEmail } = await request.json()
    
    const supabase = createClient()

    // Fetch candidate and job details
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('first_name, last_name, email')
      .eq('id', candidateId)
      .single()

    if (candidateError) throw candidateError

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(`
        title, description, location, salary_range, urgency,
        clients (company_name, contact_name)
      `)
      .eq('id', jobId)
      .single()

    if (jobError) throw jobError

    // Create email transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Generate job specification email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #7C3AED; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .job-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .logo { max-width: 200px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TransEra Solutions</h1>
          <p>Professional Recruitment Services</p>
        </div>
        <div class="content">
          <h2>Hi ${candidate.first_name},</h2>
          
          <p>We are pleased to share this exciting career opportunity with you that matches your professional background and expertise.</p>
          
          <div class="job-details">
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.clients?.company_name}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Salary Range:</strong> ${job.salary_range}</p>
            <p><strong>Urgency:</strong> ${job.urgency}</p>
            
            <h4>Job Description:</h4>
            <p>${job.description}</p>
          </div>
          
          <p>If you are interested in this position, please reply to this email or call us on 079 253 3624 to discuss further.</p>
          
          <p>We look forward to hearing from you.</p>
          
          <p>Best regards,<br>
          TransEra Solutions Team<br>
          athi@transerasolutions.co.za<br>
          www.transerasolutions.co.za</p>
        </div>
        <div class="footer">
          <p>Rosebank | Johannesburg | 2196</p>
          <p>This email was sent from TransEra Solutions CRM</p>
        </div>
      </body>
      </html>
    `

    // Send email
    const mailOptions = {
      from: '"TransEra Solutions" <athi@transerasolutions.co.za>',
      to: candidateEmail,
      subject: `Exciting Career Opportunity: ${job.title}`,
      html: emailTemplate,
    }

    const info = await transporter.sendMail(mailOptions)

    // Log email in database
    await supabase
      .from('email_automation_log')
      .insert({
        candidate_id: candidateId,
        job_id: jobId,
        email_type: 'job_spec',
        recipient_email: candidateEmail,
        subject: mailOptions.subject,
        email_body: emailTemplate,
        sent_status: 'sent',
        sent_at: new Date().toISOString(),
      })

    return NextResponse.json({ 
      success: true, 
      message: 'Job specification sent successfully',
      messageId: info.messageId 
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    )
  }
}