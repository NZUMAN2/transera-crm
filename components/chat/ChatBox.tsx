'use client'

import { useState } from 'react'

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to TransEra Chat! 👋', sender: 'system' },
    { id: 2, text: 'How can I help you today?', sender: 'system' }
  ])

  const toggleChat = () => {
    console.log('Chat button clicked!') // Debug log
    setIsOpen(!isOpen)
  }

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { 
        id: messages.length + 1, 
        text: message, 
        sender: 'user' 
      }])
      setMessage('')
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 9999,
          color: 'white',
          fontSize: '24px'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '384px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>💬 Team Chat</h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Always here to help!</p>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '12px',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '16px',
                    backgroundColor: msg.sender === 'user' ? '#667eea' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#374151',
                    maxWidth: '70%'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '24px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
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