// app/(dashboard)/workflow/workflow-board.tsx

'use client'

import { useState } from 'react'
import { updateApplicationStage } from './actions'

type Application = {
  id: string
  stage: string
  status: string
  job: {
    id: string
    title: string
    job_code: string
    status: string
  }
  candidate: {
    id: string
    first_name: string
    last_name: string
    email: string
    current_position: string
  }
}

type Stage = {
  id: string
  title: string
  color: string
}

export default function WorkflowBoard({ 
  stages, 
  applications 
}: { 
  stages: Stage[]
  applications: Application[] 
}) {
  const [isDragging, setIsDragging] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setIsDragging(applicationId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    if (isDragging) {
      await updateApplicationStage(isDragging, stageId)
      setIsDragging(null)
    }
  }

  const getApplicationsByStage = (stageId: string) => {
    return applications.filter(app => app.stage === stageId)
  }

  const getStageCount = (stageId: string) => {
    return applications.filter(app => app.stage === stageId).length
  }

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className={`${stage.color} rounded-lg p-4 text-white`}>
            <h3 className="font-semibold mb-2">{stage.title}</h3>
            <p className="text-3xl font-bold">{getStageCount(stage.id)}</p>
            <p className="text-sm opacity-75">
              {stage.id === 'sourcing' && 'Active jobs in sourcing'}
              {stage.id === 'screening' && 'Jobs in screening process'}
              {stage.id === 'interview' && 'Candidates in interview'}
              {stage.id === 'offer' && 'Offers pending'}
              {stage.id === 'placed' && 'Successful placements'}
            </p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-5 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="space-y-2">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">{stage.title}</h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {getStageCount(stage.id)} jobs
                </span>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="min-h-[400px] bg-gray-50 rounded-lg p-2 space-y-2"
              >
                {getApplicationsByStage(stage.id).map((application) => (
                  <div
                    key={application.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, application.id)}
                    className="bg-white p-3 rounded-lg shadow cursor-move hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-2">
                      <p className="text-xs text-purple-600 font-semibold">
                        {application.job?.job_code}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {application.job?.title}
                      </p>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-xs text-gray-600">
                        {application.candidate?.first_name} {application.candidate?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {application.candidate?.current_position}
                      </p>
                    </div>
                  </div>
                ))}

                {getApplicationsByStage(stage.id).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No jobs in this phase</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
              ⚡
            </div>
            <div>
              <h4 className="font-semibold text-purple-900">Quick Response</h4>
              <p className="text-sm text-purple-700">Respond to clients within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
              🎯
            </div>
            <div>
              <h4 className="font-semibold text-purple-900">Quality Matching</h4>
              <p className="text-sm text-purple-700">Focus on cultural fit & skills alignment</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
              📈
            </div>
            <div>
              <h4 className="font-semibold text-purple-900">Track Progress</h4>
              <p className="text-sm text-purple-700">Update job phases regularly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}