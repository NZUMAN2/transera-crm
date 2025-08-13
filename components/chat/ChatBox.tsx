'use client'

import { useState } from 'react'

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to TransEra Chat! 👋', sender: 'system' },
    { id: 2, text: 'How can I help you today?', sender: 'system' }
  ])

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { 
        id: messages.length + 1, 
        text: message, 
        sender: 'user' 
      }])
      setMessage('')
      
      // Auto reply
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: 'Thanks for your message! Chat system is being connected.',
          sender: 'system'
        }])
      }, 1000)
    }
  }

  return (
    <>
      {/* Chat Toggle Button - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        style={{ zIndex: 9999 }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ zIndex: 9998, height: '500px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <h3 className="font-bold text-lg">💬 Team Chat</h3>
            <p className="text-xs opacity-90">Always here to help!</p>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:scale-110 transition-transform"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}