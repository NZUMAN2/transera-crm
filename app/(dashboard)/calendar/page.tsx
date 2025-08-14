'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Event {
  id: string
  date: Date
  time: string
  title: string
  type: 'video' | 'in-person'
  candidate?: string
  role?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'video' as 'video' | 'in-person',
    candidate: '',
    role: ''
  })

  useEffect(() => {
    // Load events from localStorage
    try {
      const saved = localStorage.getItem('calendar_events')
      if (saved) {
        const parsed = JSON.parse(saved)
        setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
      }
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }, [])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const getDaysArray = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getDayEvents = (day: number) => {
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    )
  }

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title || !newEvent.time) {
      alert('Please fill in all required fields')
      return
    }

    const event: Event = {
      id: Date.now().toString(),
      date: selectedDate,
      time: newEvent.time,
      title: newEvent.title,
      type: newEvent.type,
      candidate: newEvent.candidate,
      role: newEvent.role
    }

    const updatedEvents = [...events, event]
    localStorage.setItem('calendar_events', JSON.stringify(updatedEvents))
    setEvents(updatedEvents)
    
    setNewEvent({ title: '', time: '', type: 'video', candidate: '', role: '' })
    setShowNewEvent(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Interview Calendar 📅
          </h1>
          <p className="text-gray-600 mt-1">Schedule and manage interviews</p>
        </div>
        <button
          onClick={() => {
            if (!selectedDate) setSelectedDate(new Date())
            setShowNewEvent(true)
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
        >
          ➕ Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h2 className="text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysArray().map((day, index) => (
              <div
                key={index}
                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`
                  aspect-square p-2 rounded-lg transition-all
                  ${!day ? 'invisible' : 'cursor-pointer hover:bg-gray-50'}
                  ${day === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() && 
                    currentDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-purple-100 text-purple-600 font-bold' : ''}
                  ${selectedDate?.getDate() === day && 
                    selectedDate?.getMonth() === currentDate.getMonth()
                    ? 'ring-2 ring-purple-500' : ''}
                `}
              >
                {day && (
                  <>
                    <div className="text-sm">{day}</div>
                    {getDayEvents(day).length > 0 && (
                      <div className="text-xs text-purple-600 mt-1">
                        {getDayEvents(day).length} event{getDayEvents(day).length > 1 ? 's' : ''}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events Panel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4">
            {selectedDate ? 
              selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Select a date'}
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDate && getDayEvents(selectedDate.getDate()).map(event => (
              <div
                key={event.id}
                className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
              >
                <div className="font-medium text-purple-600">{event.time}</div>
                <div className="font-semibold">{event.title}</div>
                {event.candidate && (
                  <div className="text-sm text-gray-600">
                    👤 {event.candidate} - {event.role}
                  </div>
                )}
                <div className="text-xs mt-2">
                  {event.type === 'video' ? '📹 Video Call' : '📍 In Person'}
                </div>
              </div>
            ))}
            
            {selectedDate && getDayEvents(selectedDate.getDate()).length === 0 && (
              <p className="text-gray-500 text-center py-8">No events scheduled</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showNewEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Interview - John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'video' | 'in-person' })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="video">Video Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
                <input
                  type="text"
                  value={newEvent.candidate}
                  onChange={(e) => setNewEvent({ ...newEvent, candidate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={newEvent.role}
                  onChange={(e) => setNewEvent({ ...newEvent, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewEvent(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
                >
                  Add Event
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}