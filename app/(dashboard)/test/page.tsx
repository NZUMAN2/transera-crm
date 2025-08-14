'use client'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Test Page - Everything Works!</h1>
      <div className="space-y-4">
        <div className="p-4 bg-green-100 text-green-800 rounded">
          ✅ This page loads without errors
        </div>
        <div className="p-4 bg-blue-100 text-blue-800 rounded">
          📅 Calendar functionality testing
        </div>
        <button 
          onClick={() => alert('Button works!')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Click Me
        </button>
      </div>
    </div>
  )
}