'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiUserLine, RiArrowRightLine } from 'react-icons/ri'

export default function PipelinePage() {
  const [candidates, setCandidates] = useState({
    applied: [
      { id: 1, name: 'John Doe', role: 'Software Engineer', days: 2 },
      { id: 2, name: 'Jane Smith', role: 'Product Manager', days: 5 },
      { id: 3, name: 'Mike Johnson', role: 'Designer', days: 1 }
    ],
    screening: [
      { id: 4, name: 'Sarah Williams', role: 'Data Scientist', days: 3 },
      { id: 5, name: 'Tom Brown', role: 'DevOps Engineer', days: 4 }
    ],
    interview: [
      { id: 6, name: 'Emily Davis', role: 'Frontend Developer', days: 7 },
      { id: 7, name: 'Chris Wilson', role: 'Backend Developer', days: 6 }
    ],
    offer: [
      { id: 8, name: 'Lisa Anderson', role: 'QA Engineer', days: 10 }
    ],
    hired: [
      { id: 9, name: 'Mark Taylor', role: 'Full Stack Developer', days: 15 }
    ]
  })

  const stages = [
    { key: 'applied', title: 'Applied', color: 'from-blue-500 to-cyan-500', emoji: '📝' },
    { key: 'screening', title: 'Screening', color: 'from-purple-500 to-pink-500', emoji: '🔍' },
    { key: 'interview', title: 'Interview', color: 'from-yellow-500 to-orange-500', emoji: '💬' },
    { key: 'offer', title: 'Offer', color: 'from-green-500 to-teal-500', emoji: '📨' },
    { key: 'hired', title: 'Hired', color: 'from-indigo-500 to-purple-500', emoji: '🎉' }
  ]

  const handleDragStart = (e: React.DragEvent, candidateId: number, fromStage: string) => {
    e.dataTransfer.setData('candidateId', candidateId.toString())
    e.dataTransfer.setData('fromStage', fromStage)
  }

  const handleDrop = (e: React.DragEvent, toStage: string) => {
    e.preventDefault()
    const candidateId = parseInt(e.dataTransfer.getData('candidateId'))
    const fromStage = e.dataTransfer.getData('fromStage')
    
    if (fromStage === toStage) return
    
    setCandidates(prev => {
      const candidate = prev[fromStage as keyof typeof prev].find(c => c.id === candidateId)
      if (!candidate) return prev
      
      return {
        ...prev,
        [fromStage]: prev[fromStage as keyof typeof prev].filter(c => c.id !== candidateId),
        [toStage]: [...prev[toStage as keyof typeof prev], candidate]
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Recruitment Pipeline 🚀
        </h1>
        <p className="text-gray-600 mt-1">Track candidates through the recruitment process</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stages.map(stage => (
          <div key={stage.key} className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{stage.emoji}</div>
            <div className="text-2xl font-bold">{candidates[stage.key as keyof typeof candidates].length}</div>
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
                    {candidates[stage.key as keyof typeof candidates].length}
                  </span>
                </h3>
              </div>
              
              <div className="p-4 space-y-3 min-h-[200px]">
                {candidates[stage.key as keyof typeof candidates].map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id, stage.key)}
                    className="p-3 bg-gray-50 rounded-lg cursor-move hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <RiUserLine className="text-gray-400" />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{candidate.role}</p>
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
    </div>
  )
}