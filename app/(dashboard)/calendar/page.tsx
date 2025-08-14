'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiVideoLine,
  RiMapPinLine,
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine
} from 'react-icons/ri'

interface Event {
  id: string
  date: Date
  time: string
  title: string
  type: 'video' | 'in-person'
  candidate?: string
  role?: string
  client?: string
  notes?: string
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
    role: '',
    notes: ''
  })

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  function loadEvents() {
    try {
      const savedEvents = localStorage.getItem('calendar_events')
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents)
        setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
      } else {
        // Set some default events
        setEvents([
          {
            id: '1',
            date: new Date(),
            time: '10:00 AM',
            title: 'Interview - John Doe',
            type: 'video',
            candidate: 'John Doe',
            role: 'Software Engineer'
          },
          {
            id: '2',
            date: new Date(),
            time: '2:00 PM',
            title: 'Client Meeting',
            type: 'in-person',
            client: 'Tech Corp'
          }
        ])
      }
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents([])
    }
  }

  function saveEvents(updatedEvents: Event[]) {
    try {
      localStorage.setItem('calendar_events', JSON.stringify(updatedEvents))
      setEvents(updatedEvents)
    } catch (error) {
      console.error('Error saving events:', error)
    }
  }

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

  const hasEvent = (day: number) => {
    return events.some(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    )
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
      role: newEvent.role,
      notes: newEvent.notes
    }

    const updatedEvents = [...events, event]
    saveEvents(updatedEvents)
    
    setNewEvent({
      title: '',
      time: '',
      type: 'video',
      candidate: '',
      role: '',
      notes: ''
    })
    setShowNewEvent(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== eventId)
      saveEvents(updatedEvents)
    }
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Interview Calendar 📅
          </h1>
          <p className="text-gray-600 mt-1">Schedule and manage interviews</p>
        </div>
        <button
          onClick={() => {
            if (!selectedDate) {
              setSelectedDate(new Date())
            }
            setShowNewEvent(true)
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiAddLine /> Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              ←
            </button>
            <h2 className="text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysArray().map((day, index) => (
              <div
                key={`day-${index}`}
                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`
                  aspect-square p-2 rounded-lg cursor-pointer transition-all
                  ${!day ? 'invisible' : ''}
                  ${day === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() && 
                    currentDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-purple-100 text-purple-600 font-bold' 
                    : 'hover:bg-gray-50'}
                  ${selectedDate?.getDate() === day && 
                    selectedDate?.getMonth() === currentDate.getMonth()
                    ? 'ring-2 ring-purple-500' 
                    : ''}
                `}
              >
                {day && (
                  <>
                    <div className="text-sm">{day}</div>
                    {hasEvent(day) && (
                      <div className="flex gap-1 mt-1">
                        {getDayEvents(day).slice(0, 3).map((_, i) => (
                          <div key={`dot-${day}-${i}`} className="w-1 h-1 bg-purple-500 rounded-full" />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4">
            {selectedDate ? 
              `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}` 
              : 'Select a date'}
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDate && getDayEvents(selectedDate.getDate()).length > 0 ? (
              getDayEvents(selectedDate.getDate()).map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg relative group"
                >
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                  >
                    <RiDeleteBinLine size={16} />
                  </button>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <RiTimeLine className="text-purple-600" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{event.title}</h4>
                  {event.candidate && (
                    <p className="text-sm text-gray-600">
                      <RiUserLine className="inline mr-1" />
                      {event.candidate} - {event.role}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {event.type === 'video' ? (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1">
                        <RiVideoLine size={12} /> Video Call
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1">
                        <RiMapPinLine size={12} /> In Person
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                {selectedDate ? 'No events scheduled' : 'Select a date to view events'}
              </p>
            )}
          </div>
        </div>
      </div>

      {showNewEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewEvent(false)
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Schedule Interview</h3>
              <button
                onClick={() => setShowNewEvent(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Interview - John Doe"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'video' | 'in-person' })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="video">Video Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={newEvent.candidate}
                  onChange={(e) => setNewEvent({ ...newEvent, candidate: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={newEvent.role}
                  onChange={(e) => setNewEvent({ ...newEvent, role: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  Add Event
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}