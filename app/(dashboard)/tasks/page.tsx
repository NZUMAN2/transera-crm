// app/(dashboard)/tasks/page.tsx

import { createClient } from '@/lib/supabase/server'
import { createTask, updateTaskStatus } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function TasksPage() {
  const supabase = createClient()

  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_user:users!tasks_assigned_to_fkey(full_name)
    `)
    .order('created_at', { ascending: false })

  const { data: users } = await supabase
    .from('users')
    .select('id, full_name')

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-1">Manage your daily tasks and reminders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Task Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Add Task</h2>
            <form action={createTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input 
                  id="title"
                  name="title"
                  required
                  placeholder="Follow up with client"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Task details..."
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input 
                  id="due_date"
                  name="due_date"
                  type="date"
                />
              </div>

              <div>
                <Label htmlFor="assigned_to">Assign To</Label>
                <select
                  id="assigned_to"
                  name="assigned_to"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full">
                Add Task
              </Button>
            </form>
          </div>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Tasks</h2>
            </div>
            <div className="divide-y">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.due_date && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {task.assigned_user && (
                            <span className="text-xs text-gray-500">
                              • {task.assigned_user.full_name}
                            </span>
                          )}
                        </div>
                      </div>
                      {task.status !== 'completed' && (
                        <form action={async () => {
                          'use server'
                          await updateTaskStatus(task.id, 'completed')
                        }}>
                          <Button type="submit" size="sm" variant="outline">
                            ✓ Complete
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No tasks yet. Create your first task!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}