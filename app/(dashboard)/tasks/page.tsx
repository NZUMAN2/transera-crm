'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  RiAddLine,
  RiCalendarLine,
  RiCheckLine,
  RiTimeLine
} from 'react-icons/ri'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date?: string
  created_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: ''
  })
  const supabase = createClient()

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setTasks(data)
    }
  }

  async function createTask() {
    if (!newTask.title.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('tasks').insert({
      ...newTask,
      created_by: user.id,
      assigned_to: user.id
    })

    if (!error) {
      setShowNewTask(false)
      setNewTask({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' })
      loadTasks()
    }
  }

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    urgent: 'bg-red-100 text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Task Management 📋
          </h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewTask(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiAddLine /> New Task
        </motion.button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                  {task.priority}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewTask(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Task 🎯</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Task title..."
              />
              
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="Description..."
              />
              
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewTask(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={createTask}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
                >
                  Create Task
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}