// app/(dashboard)/recruitment-workflow/page.tsx (NEW FILE)
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface WorkflowStage {
  name: string
  candidates: any[]
  actions: string[]
  responsible: string[]
}

export default function RecruitmentWorkflowPage() {
  const [stages, setStages] = useState<WorkflowStage[]>([
    {
      name: 'Job Received',
      candidates: [],
      actions: ['Document specifics', 'Schedule briefing', 'Allocate consultant'],
      responsible: ['Admin']
    },
    {
      name: 'Sourcing',
      candidates: [],
      actions: ['Convert to template', 'Post on LinkedIn', 'Search databases'],
      responsible: ['Lillian', 'Athi', 'Thembeka']
    },
    {
      name: 'Pre-Screen Call',
      candidates: [],
      actions: ['Verify contact details', 'Check salary expectations', 'Assess fit'],
      responsible: ['Athi', 'Thembeka']
    },
    {
      name: 'Interview',
      candidates: [],
      actions: ['Schedule interview', 'Prepare candidate', 'Collect feedback'],
      responsible: ['Consultant']
    },
    {
      name: 'Offer',
      candidates: [],
      actions: ['Negotiate terms', 'Send offer', 'Follow up'],
      responsible: ['Admin', 'Consultant']
    },
    {
      name: 'Placed',
      candidates: [],
      actions: ['Onboarding support', 'Check-in calls', 'Invoice client'],
      responsible: ['Admin']
    }
  ])

  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadWorkflowData()
  }, [])

  async function loadWorkflowData() {
    // Load jobs
    const jobsData = await supabase.from('jobs').select()
    setJobs(jobsData.data || [])
    
    // Load candidates and group by stage
    const candidatesData = await supabase.from('candidates').select()
    const candidates = candidatesData.data || []
    
    // Group candidates by their workflow stage
    const updatedStages = stages.map(stage => {
      const stageName = stage.name.toLowerCase().replace(' ', '_')
      return {
        ...stage,
        candidates: candidates.filter((c: any) => 
          c.workflow_stage === stageName || 
          (stageName === 'job_received' && !c.workflow_stage)
        )
      }
    })
    
    setStages(updatedStages)
  }

  async function moveCandidate(candidateId: string, fromStage: string, toStage: string) {
    // Update candidate stage
    const result = await supabase
      .from('candidates')
      .update({ 
        workflow_stage: toStage.toLowerCase().replace(' ', '_'),
        stage_updated_at: new Date().toISOString(),
        stage_updated_by: JSON.parse(localStorage.getItem('auth_user') || '{}').name
      })
      .eq('id', candidateId)
    
    if (!result.error) {
      loadWorkflowData()
    }
  }

  function handleDragStart(e: React.DragEvent, candidateId: string, stage: string) {
    e.dataTransfer.setData('candidateId', candidateId)
    e.dataTransfer.setData('fromStage', stage)
  }

  function handleDrop(e: React.DragEvent, toStage: string) {
    e.preventDefault()
    const candidateId = e.dataTransfer.getData('candidateId')
    const fromStage = e.dataTransfer.getData('fromStage')
    
    if (fromStage !== toStage) {
      moveCandidate(candidateId, fromStage, toStage)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">TransEra Recruitment Workflow</h1>
        <p className="text-gray-600">Based on your actual recruitment process</p>
        
        {/* Job Selector */}
        <div className="mt-4">
          <select 
            className="px-4 py-2 border rounded-lg"
            onChange={(e) => setSelectedJob(jobs.find(j => j.id === e.target.value))}
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-[300px] bg-white rounded-lg shadow-sm border"
            onDrop={(e) => handleDrop(e, stage.name)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-semibold">{stage.name}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {stage.responsible.join(', ')}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {stage.candidates.length} candidates
              </div>
            </div>
            
            <div className="p-4 space-y-3 min-h-[200px]">
              {/* Action Checklist */}
              <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                <div className="font-semibold mb-1">Actions:</div>
                {stage.actions.map((action, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              
              {/* Candidates */}
              {stage.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, candidate.id, stage.name)}
                  className="p-3 bg-gray-50 rounded cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-sm">{candidate.name}</div>
                  <div className="text-xs text-gray-500">{candidate.role}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {candidate.consultant && `Assigned: ${candidate.consultant}`}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Based on Workflow */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 bg-white rounded-lg border hover:shadow-md">
          <span className="text-2xl">📋</span>
          <p className="text-sm mt-2">Create Job Template</p>
        </button>
        <button className="p-4 bg-white rounded-lg border hover:shadow-md">
          <span className="text-2xl">📢</span>
          <p className="text-sm mt-2">Post to LinkedIn</p>
        </button>
        <button className="p-4 bg-white rounded-lg border hover:shadow-md">
          <span className="text-2xl">📞</span>
          <p className="text-sm mt-2">Log Pre-Screen Call</p>
        </button>
        <button className="p-4 bg-white rounded-lg border hover:shadow-md">
          <span className="text-2xl">📊</span>
          <p className="text-sm mt-2">Generate Report</p>
        </button>
      </div>
    </div>
  )
}