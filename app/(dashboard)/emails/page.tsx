'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: string
  lastUsed?: string
  timesUsed: number
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [editMode, setEditMode] = useState(false)
  
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    body: ''
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  function loadTemplates() {
    const saved = localStorage.getItem('email_templates')
    if (saved) {
      setTemplates(JSON.parse(saved))
    } else {
      // Default templates
      const defaults: EmailTemplate[] = [
        {
          id: '1',
          name: 'Interview Invitation',
          subject: 'Interview Invitation - {Position} at {Company}',
          body: `Dear {CandidateName},

We are pleased to inform you that you have been shortlisted for the {Position} role at {Company}.

We would like to invite you for an interview on {Date} at {Time}.

Location: {Location}
Duration: Approximately {Duration}

Please confirm your availability at your earliest convenience.

Best regards,
{YourName}
{Company} Recruitment Team`,
          category: 'Interview',
          timesUsed: 45
        },
        {
          id: '2',
          name: 'Application Received',
          subject: 'Application Received - {Position}',
          body: `Dear {CandidateName},

Thank you for your interest in the {Position} position at {Company}.

We have received your application and our team is currently reviewing it. We will contact you within {TimeFrame} if your profile matches our requirements.

Best regards,
{Company} HR Team`,
          category: 'Application',
          timesUsed: 128
        },
        {
          id: '3',
          name: 'Offer Letter',
          subject: 'Job Offer - {Position} at {Company}',
          body: `Dear {CandidateName},

Congratulations! We are delighted to offer you the position of {Position} at {Company}.

Key Details:
- Start Date: {StartDate}
- Salary: {Salary}
- Location: {Location}

Please find the detailed offer letter attached. Kindly confirm your acceptance within {Deadline}.

Welcome to the team!

Best regards,
{YourName}`,
          category: 'Offer',
          timesUsed: 23
        }
      ]
      setTemplates(defaults)
      localStorage.setItem('email_templates', JSON.stringify(defaults))
    }
  }

  function sendEmail() {
    if (!emailForm.to || !emailForm.subject || !emailForm.body) {
      alert('Please fill in all fields')
      return
    }

    // Simulate sending email
    const sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]')
    sentEmails.push({
      ...emailForm,
      sentAt: new Date().toISOString(),
      status: 'sent'
    })
    localStorage.setItem('sent_emails', JSON.stringify(sentEmails))

    // Update template usage
    if (selectedTemplate) {
      const updated = templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, timesUsed: t.timesUsed + 1, lastUsed: new Date().toISOString() }
          : t
      )
      setTemplates(updated)
      localStorage.setItem('email_templates', JSON.stringify(updated))
    }

    alert('Email sent successfully!')
    setShowCompose(false)
    setEmailForm({ to: '', subject: '', body: '' })
  }

  function useTemplate(template: EmailTemplate) {
    setSelectedTemplate(template)
    setEmailForm({
      to: '',
      subject: template.subject,
      body: template.body
    })
    setShowCompose(true)
  }

  function saveTemplate() {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: prompt('Template name:') || 'New Template',
      subject: emailForm.subject,
      body: emailForm.body,
      category: 'Custom',
      timesUsed: 0
    }

    const updated = [...templates, newTemplate]
    setTemplates(updated)
    localStorage.setItem('email_templates', JSON.stringify(updated))
    alert('Template saved!')
  }

  const categories = ['All', 'Interview', 'Application', 'Offer', 'Rejection', 'Custom']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Templates ✉️
          </h1>
          <p className="text-gray-600 mt-1">Manage and send email templates</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
        >
          ✏️ Compose Email
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">{template.name}</h3>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                {template.category}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {template.subject}
            </p>
            
            <div className="text-xs text-gray-500 mb-4">
              Used {template.timesUsed} times
              {template.lastUsed && (
                <span> • Last: {new Date(template.lastUsed).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => useTemplate(template)}
                className="flex-1 px-3 py-1.5 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 text-sm"
              >
                Use Template
              </button>
              <button
                onClick={() => {
                  setSelectedTemplate(template)
                  setEmailForm({
                    to: '',
                    subject: template.subject,
                    body: template.body
                  })
                  setEditMode(true)
                  setShowCompose(true)
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm"
              >
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editMode ? 'Edit Template' : 'Compose Email'}
              </h3>
              <button
                onClick={() => {
                  setShowCompose(false)
                  setEditMode(false)
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={emailForm.body}
                  onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="text-xs text-gray-500">
                💡 Tip: Use placeholders like {'{CandidateName}'}, {'{Position}'}, {'{Company}'} for dynamic content
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveTemplate}
                  className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                >
                  💾 Save as Template
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  📤 Send Email
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}