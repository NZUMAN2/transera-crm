'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RiFileListLine,
  RiUploadLine,
  RiDownloadLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiCloseLine,
  RiUserLine,
  RiBriefcaseLine,
  RiBuilding2Line
} from 'react-icons/ri'

interface Submission {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  client: string
  submittedDate: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  cvUrl?: string
  notes?: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [showAddSubmission, setShowAddSubmission] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all')
  const [newSubmission, setNewSubmission] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    client: '',
    notes: ''
  })

  useEffect(() => {
    loadSubmissions()
  }, [])

  function loadSubmissions() {
    const saved = localStorage.getItem('cv_submissions')
    if (saved) {
      setSubmissions(JSON.parse(saved))
    } else {
      // Set default submissions
      setSubmissions([
        {
          id: '1',
          candidateName: 'John Doe',
          candidateEmail: 'john@example.com',
          position: 'Senior Software Engineer',
          client: 'Tech Corp',
          submittedDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          candidateName: 'Jane Smith',
          candidateEmail: 'jane@example.com',
          position: 'Product Manager',
          client: 'StartupXYZ',
          submittedDate: new Date(Date.now() - 172800000).toISOString(),
          status: 'reviewed'
        },
        {
          id: '3',
          candidateName: 'Mike Johnson',
          candidateEmail: 'mike@example.com',
          position: 'UI/UX Designer',
          client: 'Design Studio',
          submittedDate: new Date(Date.now() - 259200000).toISOString(),
          status: 'accepted'
        }
      ])
    }
  }

  function saveSubmissions(updated: Submission[]) {
    localStorage.setItem('cv_submissions', JSON.stringify(updated))
    setSubmissions(updated)
  }

  function handleAddSubmission() {
    if (!newSubmission.candidateName || !newSubmission.position || !newSubmission.client) {
      alert('Please fill in all required fields')
      return
    }

    const submission: Submission = {
      id: Date.now().toString(),
      candidateName: newSubmission.candidateName,
      candidateEmail: newSubmission.candidateEmail,
      position: newSubmission.position,
      client: newSubmission.client,
      submittedDate: new Date().toISOString(),
      status: 'pending',
      notes: newSubmission.notes
    }

    saveSubmissions([submission, ...submissions])
    setNewSubmission({
      candidateName: '',
      candidateEmail: '',
      position: '',
      client: '',
      notes: ''
    })
    setShowAddSubmission(false)
  }

  function handleStatusChange(submissionId: string, newStatus: Submission['status']) {
    const updated = submissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    )
    saveSubmissions(updated)
  }

  function handleDelete(submissionId: string) {
    if (confirm('Delete this submission?')) {
      saveSubmissions(submissions.filter(s => s.id !== submissionId))
    }
  }

  const filteredSubmissions = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-600'
      case 'rejected': return 'bg-red-100 text-red-600'
      case 'reviewed': return 'bg-blue-100 text-blue-600'
      case 'pending': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    reviewed: submissions.filter(s => s.status === 'reviewed').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            CV Submissions 📄
          </h1>
          <p className="text-gray-600 mt-1">Track candidate submissions to clients</p>
        </div>
        <button
          onClick={() => setShowAddSubmission(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiUploadLine /> Submit CV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
          <div className="text-sm text-gray-600">Reviewed</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              filter === status
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6">Candidate</th>
                <th className="text-left py-3 px-6">Position</th>
                <th className="text-left py-3 px-6">Client</th>
                <th className="text-left py-3 px-6">Submitted</th>
                <th className="text-left py-3 px-6">Status</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(submission => (
                  <tr key={submission.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">
                      <div>
                        <p className="font-medium">{submission.candidateName}</p>
                        <p className="text-xs text-gray-500">{submission.candidateEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-6">{submission.position}</td>
                    <td className="py-3 px-6">{submission.client}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {new Date(submission.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusChange(submission.id, e.target.value as Submission['status'])}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <RiEyeLine />
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Submission Modal */}
      {showAddSubmission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Submit CV to Client</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  value={newSubmission.candidateName}
                  onChange={(e) => setNewSubmission({ ...newSubmission, candidateName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Email
                </label>
                <input
                  type="email"
                  value={newSubmission.candidateEmail}
                  onChange={(e) => setNewSubmission({ ...newSubmission, candidateEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  value={newSubmission.position}
                  onChange={(e) => setNewSubmission({ ...newSubmission, position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <input
                  type="text"
                  value={newSubmission.client}
                  onChange={(e) => setNewSubmission({ ...newSubmission, client: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newSubmission.notes}
                  onChange={(e) => setNewSubmission({ ...newSubmission, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddSubmission(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubmission}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* View Submission Modal */}
      {selectedSubmission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Submission Details</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Candidate</label>
                <p className="font-medium">{selectedSubmission.candidateName}</p>
                <p className="text-sm text-gray-600">{selectedSubmission.candidateEmail}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="font-medium">{selectedSubmission.position}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Client</label>
                <p className="font-medium">{selectedSubmission.client}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                <p className="font-medium">
                  {new Date(selectedSubmission.submittedDate).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </p>
              </div>

              {selectedSubmission.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-700">{selectedSubmission.notes}</p>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}