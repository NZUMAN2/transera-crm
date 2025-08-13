export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-1">Manage your daily tasks and reminders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Add Task</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Follow up with client"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Task details..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add Task
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Tasks</h2>
            </div>
            
            <div className="p-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Accountant</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      please compile the report before 12:00
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">low</span>
                      <span className="text-xs text-gray-500">pending</span>
                      <span className="text-xs text-gray-500">Due: 8/11/2025</span>
                      <span className="text-xs text-gray-500">• Test User</span>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    ✓ Complete
                  </button>
                </div>
              </div>
              
              <div className="text-center text-gray-500 mt-8">
                <p>No more tasks for today!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}