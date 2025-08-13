'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import {
  RiAddLine,
  RiCalendarLine,
  RiFlag2Line,
  RiUserLine,
  RiMoreLine,
  RiCheckLine,
  RiTimeLine,
  RiAttachment2
} from 'react-icons/ri'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assigned_to: string
  due_date: string
  tags: string[]
}

const columns = {
  todo: { title: 'To Do 📝', color: 'from-gray-400 to-gray-500' },
  in_progress: { title: 'In Progress 🚀', color: 'from-blue-400 to-blue-500' },
  review: { title: 'Review 👀', color: 'from-yellow-400 to-orange-500' },
  completed: { title: 'Completed ✅', color: 'from-green-400 to-green-500' }
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    in_progress: [],
    review: [],
    completed: []
  })
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
    due_date: ''
  })
  const supabase = createClient()

  useEffect(() => {
    loadTasks()
    subscribeToTasks()
  }, [])

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      const grouped = data.reduce((acc, task) => {
        if (!acc[task.status]) acc[task.status] = []
        acc[task.status].push(task)
        return acc
      }, {} as Record<string, Task[]>)
      
      setTasks({
        todo: grouped.todo || [],
        in_progress: grouped.in_progress || [],
        review: grouped.review || [],
        completed: grouped.completed || []
      })
    }
  }

  function subscribeToTasks() {
    const channel = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function handleDragEnd(result: any) {
    if (!result.destination) return

    const { source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const sourceColumn = [...tasks[source.droppableId]]
    const destColumn = source.droppableId === destination.droppableId 
      ? sourceColumn 
      : [...tasks[destination.droppableId]]
    
    const [removed] = sourceColumn.splice(source.index, 1)
    destColumn.splice(destination.index, 0, removed)

    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn
    })

    // Update task status in database
    await supabase
      .from('tasks')
      .update({ status: destination.droppableId })
      .eq('id', removed.id)

    toast.success('Task moved successfully!')
  }

  async function createTask() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('tasks').insert({
      ...newTask,
      assigned_by: user.id,
      status: 'todo'
    })

    if (!error) {
      toast.success('Task created!')
      setShowNewTask(false)
      setNewTask({ title: '', description: '', priority: 'medium', assigned_to: '', due_date: '' })
      loadTasks()
    }
  }

  const priorityColors = {
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-blue-200 text-blue-700',
    high: 'bg-orange-200 text-orange-700',
    urgent: 'bg-red-200 text-red-700'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Task Management 📋
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewTask(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiAddLine /> New Task
        </motion.button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-gray-50 rounded-xl p-4">
              <div className={`bg-gradient-to-r ${column.color} text-white rounded-lg p-3 mb-4`}>
                <h3 className="font-bold">{column.title}</h3>
                <span className="text-sm opacity-90">{tasks[columnId]?.length || 0} tasks</span>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] ${
                      snapshot.isDraggingOver ? 'bg-purple-50 rounded-lg' : ''
                    }`}
                  >
                    {tasks[columnId]?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{task.title}</h4>
                              <button className="text-gray-400 hover:text-gray-600">
                                <RiMoreLine size={16} />
                              </button>
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </span>
                              {task.tags?.map(tag => (
                                <span key={tag} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              {task.due_date && (
                                <div className="flex items-center gap-1">
                                  <RiCalendarLine size={12} />
                                  {format(new Date(task.due_date), 'MMM d')}
                                </div>
                              )}
                              {task.assigned_to && (
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* New Task Modal */}
      {showNewTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              
              <textarea
                placeholder="Description..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewTask(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createTask}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
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