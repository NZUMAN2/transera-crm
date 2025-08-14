'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiUserLine, RiArrowRightLine, RiAddLine, RiDeleteBinLine } from 'react-icons/ri'

interface Candidate {
  id: string
  name: string
  role: string
  days: number
  email?: string
  phone?: string
}

interface PipelineData {
  applied: Candidate[]
  screening: Candidate[]
  interview: Candidate[]
  offer: Candidate[]
  hired: Candidate[]
}

export default function PipelinePage() {
  const [candidates, setCandidates] = useState<PipelineData>({
    applied: [],
    screening: [],
    interview: [],
    offer: [],
    hired: []
  })
  
  const [showAddCandidate, setShowAddCandidate] = useState(false)
  const [selectedStage, setSelectedStage] = useState<keyof PipelineData>('applied')
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    loadPipelineData()
  }, [])

  function loadPipelineData() {
    const saved = localStorage.getItem('pipeline_data')
    if (saved) {
      setCandidates(JSON.parse(saved))
    } else {
      // Set default data
      setCandidates({
        applied: [
          { id: '1', name: 'John Doe', role: 'Software Engineer', days: 2 },
          { id: '2', name: 'Jane Smith', role: 'Product Manager', days: 5 }
        ],
        screening: [
          { id: '3', name: 'Sarah Williams', role: 'Data Scientist', days: 3 }
        ],
        interview: [
          { id: '4', name: 'Emily Davis', role: 'Frontend Developer', days: 7 }
        ],
        offer: [
          { id: '5', name: 'Lisa Anderson', role: 'QA Engineer', days: 10 }
        ],
        hired: [
          { id: '6', name: 'Mark Taylor', role: 'Full Stack Developer', days: 15 }
        ]
      })
    }
  }

  function savePipelineData(data: PipelineData) {
    localStorage.setItem('pipeline_data', JSON.stringify(data))
    setCandidates(data)
  }

  const stages = [
    { key: 'applied' as const, title: 'Applied', color: 'from-blue-500 to-cyan-500', emoji: '📝' },
    { key: 'screening' as const, title: 'Screening', color: 'from-purple-500 to-pink-500', emoji: '🔍' },
    { key: 'interview' as const, title: 'Interview', color: 'from-yellow-500 to-orange-500', emoji: '💬' },
    { key: 'offer' as const, title: 'Offer', color: 'from-green-500 to-teal-500', emoji: '📨' },
    { key: 'hired' as const, title: 'Hired', color: 'from-indigo-500 to-purple-500', emoji: '🎉' }
  ]

  const handleDragStart = (e: React.DragEvent, candidateId: string, fromStage: string) => {
    e.dataTransfer.setData('candidateId', candidateId)
    e.dataTransfer.setData('fromStage', fromStage)
  }

  const handleDrop = (e: React.DragEvent, toStage: keyof PipelineData) => {
    e.preventDefault()
    const candidateId = e.dataTransfer.getData('candidateId')
    const fromStage = e.dataTransfer.getData('fromStage') as keyof PipelineData
    
    if (fromStage === toStage) return
    
    const candidate = candidates[fromStage].find(c => c.id === candidateId)
    if (!candidate) return
    
    const newData = {
      ...candidates,
      [fromStage]: candidates[fromStage].filter(c => c.id !== candidateId),
      [toStage]: [...candidates[toStage], { ...candidate, days: 0 }]
    }
    
    savePipelineData(newData)
  }

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.role) {
      alert('Please fill in name and role')
      return
    }

    const candidate: Candidate = {
      id: Date.now().toString(),
      name: newCandidate.name,
      role: newCandidate.role,
      email: newCandidate.email,
      phone: newCandidate.phone,
      days: 0
    }

    const newData = {
      ...candidates,
      [selectedStage]: [...candidates[selectedStage], candidate]
    }
    
    savePipelineData(newData)
    
    // Reset form
    setNewCandidate({ name: '', role: '', email: '', phone: '' })
    setShowAddCandidate(false)
  }

  const handleDeleteCandidate = (stage: keyof PipelineData, candidateId: string) => {
    if (confirm('Remove this candidate from the pipeline?')) {
      const newData = {
        ...candidates,
        [stage]: candidates[stage].filter(c => c.id !== candidateId)
      }
      savePipelineData(newData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recruitment Pipeline 🚀
          </h1>
          <p className="text-gray-600 mt-1">Drag candidates between stages</p>
        </div>
        <button
          onClick={() => setShowAddCandidate(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiAddLine /> Add Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stages.map(stage => (
          <div key={stage.key} className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{stage.emoji}</div>
            <div className="text-2xl font-bold">{candidates[stage.key].length}</div>
            <div className="text-sm text-gray-600">{stage.title}</div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage, stageIndex) => (
          <div key={stage.key} className="flex items-start gap-2">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage.key)}
              className="w-72 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className={`bg-gradient-to-r ${stage.color} text-white p-4 rounded-t-xl`}>
                <h3 className="font-bold flex items-center gap-2">
                  <span>{stage.emoji}</span>
                  {stage.title}
                  <span className="ml-auto bg-white/20 px-2 py-1 rounded text-sm">
                    {candidates[stage.key].length}
                  </span>
                </h3>
              </div>
              
              <div className="p-4 space-y-3 min-h-[200px]">
                {candidates[stage.key].map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id, stage.key)}
                    className="p-3 bg-gray-50 rounded-lg cursor-move hover:shadow-md transition-all group relative"
                  >
                    <button
                      onClick={() => handleDeleteCandidate(stage.key, candidate.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <RiUserLine className="text-gray-400" />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{candidate.role}</p>
                    {candidate.email && (
                      <p className="text-xs text-gray-400 mt-1">📧 {candidate.email}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{candidate.days} days in stage</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {stageIndex < stages.length - 1 && (
              <RiArrowRightLine className="text-gray-300 mt-12" size={24} />
            )}
          </div>
        ))}
      </div>

      {/* Add Candidate Modal */}
      {showAddCandidate && (
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
            <h3 className="text-xl font-bold mb-4">Add Candidate to Pipeline</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as keyof PipelineData)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {stages.map(stage => (
                    <option key={stage.key} value={stage.key}>
                      {stage.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  value={newCandidate.role}
                  onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddCandidate(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCandidate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}