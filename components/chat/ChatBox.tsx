'use client'

import { useState, useRef } from 'react'

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to TransEra Chat! 👋', sender: 'system', time: new Date() },
    { id: 2, text: 'How can I help you today?', sender: 'system', time: new Date() }
  ])
  const [showEmoji, setShowEmoji] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '✅', '💼', '📧', '📅', '🚀']

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setShowEmoji(false)
  }

  const sendMessage = () => {
    if (message.trim() === '') return
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      time: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Thanks for your message! I received: "' + message + '"',
        sender: 'system',
        time: new Date()
      }])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmoji(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `📎 File attached: ${file.name}`,
        sender: 'user',
        time: new Date()
      }])
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 9999,
          color: 'white',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

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
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              💬 Team Chat
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
              Always here to help!
            </p>
          </div>

          {/* Messages Container */}
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
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '8px 16px',
                    borderRadius: '16px',
                    backgroundColor: msg.sender === 'user' ? '#667eea' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#374151',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  <div>{msg.text}</div>
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    marginTop: '4px'
                  }}>
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
              width: '200px'
            }}>
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Emoji Button */}
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
                title="Add emoji"
              >
                😊
              </button>

              {/* File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
                title="Attach file"
              >
                📎
              </button>

              {/* Message Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '24px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: message.trim() 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#e5e7eb',
                  border: 'none',
                  color: 'white',
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Send message"
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