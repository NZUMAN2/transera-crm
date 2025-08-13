'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiVideoLine,
  RiMapPinLine,
  RiAddLine
} from 'react-icons/ri'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [events, setEvents] = useState([
    { id: 1, date: new Date(2025, 0, 15), time: '10:00 AM', title: 'Interview - John Doe', type: 'video', candidate: 'John Doe', role: 'Software Engineer' },
    { id: 2, date: new Date(2025, 0, 15), time: '2:00 PM', title: 'Interview - Jane Smith', type: 'in-person', candidate: 'Jane Smith', role: 'Product Manager' },
    { id: 3, date: new Date(2025, 0, 17), time: '11:00 AM', title: 'Client Meeting', type: 'video', client: 'Tech Corp' },
    { id: 4, date: new Date(2025, 0, 20), time: '3:00 PM', title: 'Final Interview', type: 'video', candidate: 'Mike Johnson', role: 'Designer' }
  ])

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

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
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
          onClick={() => setShowNewEvent(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          <RiAddLine /> Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Month Navigation */}
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
                          <div key={i} className="w-1 h-1 bg-purple-500 rounded-full" />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Day's Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4">
            {selectedDate ? 
              `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}` 
              : 'Select a date'}
          </h3>
          
          <div className="space-y-3">
            {selectedDate && getDayEvents(selectedDate.getDate()).length > 0 ? (
              getDayEvents(selectedDate.getDate()).map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                >
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
              <p className="text-gray-500 text-center py-8">No events scheduled</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Upcoming Interviews 🎯</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.slice(0, 4).map(event => (
            <div key={event.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">
                {event.date.toLocaleDateString()}
              </div>
              <h4 className="font-medium text-sm mb-1">{event.title}</h4>
              <p className="text-xs text-gray-600">{event.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}