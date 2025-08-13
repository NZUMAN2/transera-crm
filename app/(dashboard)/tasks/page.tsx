'use client'

import { useState } from 'react'

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Sample Task 1', priority: 'high', status: 'todo' },
    { id: 2, title: 'Sample Task 2', priority: 'medium', status: 'in_progress' }
  ])
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, {
        id: tasks.length + 1,
        title: newTaskTitle,
        priority: 'medium',
        status: 'todo'
      }])
      setNewTaskTitle('')
      setShowNewTask(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-600">
            Task Management 📋
          </h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          + New Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <h3 className="font-semibold mb-2">{task.title}</h3>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-1 rounded ${
                task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {task.priority}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewTask(false)}
                className="flex-1 px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}