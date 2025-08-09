import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    const data = await resend.emails.send({
      from: 'TransEra CRM <noreply@transera.com>',
      to,
      subject,
      html,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}