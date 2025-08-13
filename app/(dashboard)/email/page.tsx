'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiMailLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'

export default function EmailPage() {
  const [templates] = useState([
    { id: 1, name: 'Initial Outreach', category: 'Candidate', uses: 245 },
    { id: 2, name: 'Interview Invitation', category: 'Candidate', uses: 189 },
    { id: 3, name: 'Job Offer', category: 'Candidate', uses: 76 },
    { id: 4, name: 'New Opening', category: 'Client', uses: 134 },
    { id: 5, name: 'Candidate Submission', category: 'Client', uses: 92 }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Templates 📧
          </h1>
          <p className="text-gray-600 mt-1">Manage your email templates</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
          + New Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6">Template Name</th>
                <th className="text-left py-3 px-6">Category</th>
                <th className="text-left py-3 px-6">Uses</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">{template.name}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.category === 'Candidate' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {template.category}
                    </span>
                  </td>
                  <td className="py-3 px-6">{template.uses}</td>
                  <td className="py-3 px-6">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RiEditLine className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RiDeleteBinLine className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}