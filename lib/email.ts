export async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, subject, html }),
  })

  return response.json()
}

// Email templates
export const emailTemplates = {
  candidateWelcome: (name: string) => ({
    subject: 'Welcome to TransEra Solutions',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Thank you for joining our talent pool. We'll be in touch soon with exciting opportunities.</p>
      <p>Best regards,<br>TransEra Team</p>
    `
  }),
  
  interviewInvite: (name: string, jobTitle: string, date: string) => ({
    subject: `Interview Invitation - ${jobTitle}`,
    html: `
      <h2>Dear ${name},</h2>
      <p>You've been selected for an interview for the ${jobTitle} position.</p>
      <p><strong>Date:</strong> ${date}</p>
      <p>Please confirm your availability.</p>
      <p>Best regards,<br>TransEra Team</p>
    `
  })
}