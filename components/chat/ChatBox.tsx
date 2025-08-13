'use client'

import ChatBox from '@/components/chat/ChatBox' 
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  // Get current user
  useEffect(() => {
    getCurrentUser()
  }, [])

  // Load messages when chat opens
  useEffect(() => {
    if (isOpen && user) {
      loadMessages()
      subscribeToMessages()
    }
  }, [isOpen, user])

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function loadMessages() {
    try {
      // For now, load sample messages since chat tables might not exist
      setMessages([
        { id: 1, message_text: 'Welcome to TransEra Chat! 👋', sender_id: 'system' },
        { id: 2, message_text: 'Messages will be saved once database is configured.', sender_id: 'system' }
      ])
      
      // Uncomment when chat_messages table exists:
      /*
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)
      
      if (data) {
        setMessages(data)
      }
      */
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  function subscribeToMessages() {
    // Uncomment when realtime is configured:
    /*
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          setMessages(current => [...current, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }

  async function sendMessage() {
    if (!message.trim() || !user) return
    
    setLoading(true)
    
    try {
      // For now, just add to local state
      const newMessage = {
        id: Date.now(),
        message_text: message,
        sender_id: user.id,
        created_at: new Date().toISOString()
      }
      
      setMessages(current => [...current, newMessage])
      setMessage('')
      
      // Uncomment when chat_messages table exists:
      /*
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          message_text: message,
          sender_id: user.id,
          conversation_id: 'general' // You'll need to create/select a conversation
        })
      
      if (error) {
        console.error('Error sending message:', error)
      }
      */
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(current => [...current, {
          id: Date.now(),
          message_text: 'Database connection coming soon! For now, messages are temporary.',
          sender_id: 'system',
          created_at: new Date().toISOString()
        }])
      }, 1000)
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <h3 className="font-bold text-lg">💬 Team Chat</h3>
            <p className="text-xs opacity-90">
              {user ? `Logged in as: ${user.email}` : 'Connecting...'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${
                  msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.sender_id === user?.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div>{msg.message_text}</div>
                  {msg.created_at && (
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder={user ? "Type a message..." : "Please login to chat"}
                disabled={!user || loading}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!user || loading || !message.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}