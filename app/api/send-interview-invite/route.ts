// app/api/send-interview-invite/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { candidateId, jobId, interviewDetails } = await request.json()
    
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
          .interview-details { background: #e6f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Interview Invitation</h1>
          <p>TransEra Solutions</p>
        </div>
        <div class="content">
          <h2>Dear ${candidate.first_name},</h2>
          
          <p>Congratulations! We are pleased to invite you for an interview for the position of <strong>${job.title}</strong> with <strong>${job.clients?.company_name}</strong>.</p>
          
          <div class="interview-details">
            <h3>Interview Details:</h3>
            <p><strong>Date:</strong> ${interviewDetails.date}</p>
            <p><strong>Time:</strong> ${interviewDetails.time}</p>
            <p><strong>Venue:</strong> ${interviewDetails.venue}</p>
            <p><strong>Address:</strong> ${interviewDetails.address}</p>
            <p><strong>Interview Panel:</strong> ${interviewDetails.panel}</p>
            <p><strong>Format:</strong> ${interviewDetails.format}</p>
          </div>
          
          <p><strong>What to bring:</strong></p>
          <ul>
            <li>Valid ID document</li>
            <li>Updated CV</li>
            <li>Relevant certificates/qualifications</li>
            <li>Any portfolio items (if applicable)</li>
          </ul>
          
          <p>Please confirm your attendance by replying to this email or calling us on 079 253 3624.</p>
          
          <p>We wish you the best of luck!</p>
          
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
      subject: `Interview Invitation - ${job.title}`,
      html: emailTemplate,
    }

    const info = await transporter.sendMail(mailOptions)

    // Log email
    await supabase
      .from('email_automation_log')
      .insert({
        candidate_id: candidateId,
        job_id: jobId,
        email_type: 'interview_invitation',
        recipient_email: candidate.email,
        subject: mailOptions.subject,
        email_body: emailTemplate,
        sent_status: 'sent',
        sent_at: new Date().toISOString(),
      })

    return NextResponse.json({ 
      success: true, 
      message: 'Interview invitation sent successfully' 
    })

  } catch (error) {
    console.error('Error sending interview invitation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send interview invitation' },
      { status: 500 }
    )
  }
}