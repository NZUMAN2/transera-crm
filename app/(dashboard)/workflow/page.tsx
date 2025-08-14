'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RiFlowChart,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiTimeLine,
  RiArrowRightLine,
  RiDragMoveLine
} from 'react-icons/ri'

interface WorkflowStep {
  id: string
  name: string
  description: string
  duration: string
  assignee: string
  status: 'pending' | 'active' | 'completed'
  order: number
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  createdAt: string
  status: 'active' | 'paused' | 'completed'
}

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [showAddWorkflow, setShowAddWorkflow] = useState(false)
  const [showAddStep, setShowAddStep] = useState(false)
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: ''
  })
  const [newStep, setNewStep] = useState({
    name: '',
    description: '',
    duration: '',
    assignee: ''
  })

  useEffect(() => {
    loadWorkflows()
  }, [])

  function loadWorkflows() {
    const saved = localStorage.getItem('workflows')
    if (saved) {
      setWorkflows(JSON.parse(saved))
    } else {
      // Create default workflows
      const defaultWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Standard Recruitment Process',
          description: 'Complete recruitment workflow from application to hire',
          status: 'active',
          createdAt: new Date().toISOString(),
          steps: [
            {
              id: '1-1',
              name: 'Application Review',
              description: 'Review candidate application and resume',
              duration: '1-2 days',
              assignee: 'Recruitment Team',
              status: 'completed',
              order: 1
            },
            {
              id: '1-2',
              name: 'Phone Screening',
              description: 'Initial phone screening with candidate',
              duration: '1 day',
              assignee: 'HR Team',
              status: 'active',
              order: 2
            },
            {
              id: '1-3',
              name: 'Technical Interview',
              description: 'Technical assessment with hiring manager',
              duration: '2-3 days',
              assignee: 'Technical Team',
              status: 'pending',
              order: 3
            },
            {
              id: '1-4',
              name: 'Final Interview',
              description: 'Final round with senior management',
              duration: '1-2 days',
              assignee: 'Management',
              status: 'pending',
              order: 4
            },
            {
              id: '1-5',
              name: 'Offer & Negotiation',
              description: 'Extend offer and negotiate terms',
              duration: '2-3 days',
              assignee: 'HR Team',
              status: 'pending',
              order: 5
            }
          ]
        }
      ]
      setWorkflows(defaultWorkflows)
      setSelectedWorkflow(defaultWorkflows[0])
    }
  }

  function saveWorkflows(updated: Workflow[]) {
    localStorage.setItem('workflows', JSON.stringify(updated))
    setWorkflows(updated)
  }

  function handleAddWorkflow() {
    if (!newWorkflow.name) {
      alert('Please enter a workflow name')
      return
    }

    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: 'active',
      createdAt: new Date().toISOString(),
      steps: []
    }

    const updated = [...workflows, workflow]
    saveWorkflows(updated)
    setSelectedWorkflow(workflow)
    setNewWorkflow({ name: '', description: '' })
    setShowAddWorkflow(false)
  }

  function handleDeleteWorkflow(workflowId: string) {
    if (confirm('Delete this workflow?')) {
      const updated = workflows.filter(w => w.id !== workflowId)
      saveWorkflows(updated)
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(updated[0] || null)
      }
    }
  }

  function handleAddStep() {
    if (!selectedWorkflow || !newStep.name || !newStep.assignee) {
      alert('Please fill in all required fields')
      return
    }

    const step: WorkflowStep = {
      id: Date.now().toString(),
      name: newStep.name,
      description: newStep.description,
      duration: newStep.duration,
      assignee: newStep.assignee,
      status: 'pending',
      order: selectedWorkflow.steps.length + 1
    }

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, step]
    }

    const updated = workflows.map(w => 
      w.id === selectedWorkflow.id ? updatedWorkflow : w
    )
    
    saveWorkflows(updated)
    setSelectedWorkflow(updatedWorkflow)
    setNewStep({ name: '', description: '', duration: '', assignee: '' })
    setShowAddStep(false)
  }

  function handleUpdateStep() {
    if (!selectedWorkflow || !editingStep) return

    const updatedSteps = selectedWorkflow.steps.map(step =>
      step.id === editingStep.id ? editingStep : step
    )

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps
    }

    const updated = workflows.map(w =>
      w.id === selectedWorkflow.id ? updatedWorkflow : w
    )

    saveWorkflows(updated)
    setSelectedWorkflow(updatedWorkflow)
    setEditingStep(null)
  }

  function handleDeleteStep(stepId: string) {
    if (!selectedWorkflow) return
    
    if (confirm('Delete this step?')) {
      const updatedSteps = selectedWorkflow.steps
        .filter(s => s.id !== stepId)
        .map((step, index) => ({ ...step, order: index + 1 }))

      const updatedWorkflow = {
        ...selectedWorkflow,
        steps: updatedSteps
      }

      const updated = workflows.map(w =>
        w.id === selectedWorkflow.id ? updatedWorkflow : w
      )

      saveWorkflows(updated)
      setSelectedWorkflow(updatedWorkflow)
    }
  }

  function handleStepStatusChange(stepId: string, newStatus: WorkflowStep['status']) {
    if (!selectedWorkflow) return

    const updatedSteps = selectedWorkflow.steps.map(step =>
      step.id === stepId ? { ...step, status: newStatus } : step
    )

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps
    }

    const updated = workflows.map(w =>
      w.id === selectedWorkflow.id ? updatedWorkflow : w
    )

    saveWorkflows(updated)
    setSelectedWorkflow(updatedWorkflow)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-600'
      case 'active': return 'bg-blue-100 text-blue-600'
      case 'pending': return 'bg-gray-100 text-gray-600'
      case 'paused': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recruitment Workflow 🔄
          </h1>
          <p className="text-gray-600 mt-1">Design and manage recruitment workflows</p>
        </div>
        <button
          onClick={() => setShowAddWorkflow(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiAddLine /> New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-bold text-lg mb-3">Workflows</h3>
          {workflows.map(workflow => (
            <motion.div
              key={workflow.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedWorkflow(workflow)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedWorkflow?.id === workflow.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{workflow.name}</h4>
                  <p className={`text-xs mt-1 ${
                    selectedWorkflow?.id === workflow.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {workflow.steps.length} steps
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteWorkflow(workflow.id)
                  }}
                  className={`p-1 rounded hover:bg-white/20 ${
                    selectedWorkflow?.id === workflow.id ? 'text-white' : 'text-red-500'
                  }`}
                >
                  <RiDeleteBinLine size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow Details */}
        <div className="lg:col-span-3">
          {selectedWorkflow ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedWorkflow.name}</h2>
                  <p className="text-gray-600">{selectedWorkflow.description}</p>
                </div>
                <button
                  onClick={() => setShowAddStep(true)}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center gap-2"
                >
                  <RiAddLine /> Add Step
                </button>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                {selectedWorkflow.steps.length > 0 ? (
                  selectedWorkflow.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Connection Line */}
                      {index < selectedWorkflow.steps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-20 bg-gray-300" />
                      )}
                      
                      <div className="flex items-start gap-4">
                        {/* Step Number */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'active' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}>
                          {step.status === 'completed' ? <RiCheckLine /> : step.order}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{step.name}</h4>
                              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                              
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <RiTimeLine /> {step.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <RiUserLine /> {step.assignee}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(step.status)}`}>
                                  {step.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={step.status}
                                onChange={(e) => handleStepStatusChange(step.id, e.target.value as WorkflowStep['status'])}
                                className="px-2 py-1 text-sm border rounded"
                              >
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                              </select>
                              
                              <button
                                onClick={() => setEditingStep(step)}
                                className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                              >
                                <RiEditLine size={16} />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteStep(step.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <RiDeleteBinLine size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No steps added yet</p>
                    <button
                      onClick={() => setShowAddStep(true)}
                      className="mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                    >
                      Add First Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-gray-500">Select a workflow to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Workflow Modal */}
      {showAddWorkflow && (
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
            <h3 className="text-xl font-bold mb-4">Create New Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddWorkflow(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWorkflow}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add/Edit Step Modal */}
      {(showAddStep || editingStep) && (
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
            <h3 className="text-xl font-bold mb-4">
              {editingStep ? 'Edit Step' : 'Add New Step'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step Name *
                </label>
                <input
                  type="text"
                  value={editingStep ? editingStep.name : newStep.name}
                  onChange={(e) => editingStep
                    ? setEditingStep({ ...editingStep, name: e.target.value })
                    : setNewStep({ ...newStep, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingStep ? editingStep.description : newStep.description}
                  onChange={(e) => editingStep
                    ? setEditingStep({ ...editingStep, description: e.target.value })
                    : setNewStep({ ...newStep, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={editingStep ? editingStep.duration : newStep.duration}
                  onChange={(e) => editingStep
                    ? setEditingStep({ ...editingStep, duration: e.target.value })
                    : setNewStep({ ...newStep, duration: e.target.value })
                  }
                  placeholder="e.g. 1-2 days"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee *
                </label>
                <input
                  type="text"
                  value={editingStep ? editingStep.assignee : newStep.assignee}
                  onChange={(e) => editingStep
                    ? setEditingStep({ ...editingStep, assignee: e.target.value })
                    : setNewStep({ ...newStep, assignee: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddStep(false)
                    setEditingStep(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingStep ? handleUpdateStep : handleAddStep}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  {editingStep ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}