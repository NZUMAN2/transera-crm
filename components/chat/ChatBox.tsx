'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { 
  RiSendPlaneFill, 
  RiAttachment2, 
  RiTaskLine,
  RiCheckDoubleLine,
  RiMoreLine,
  RiEmotionLine,
  RiCloseLine,
  RiSearchLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

interface Message {
  id: string
  message_text: string
  sender_id: string
  sender_name?: string
  sender_avatar?: string
  created_at: string
  is_read?: boolean
  message_type: 'text' | 'file' | 'task'
  attachments?: any
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Initialize realtime subscriptions
  useEffect(() => {
    if (!activeConversation) return

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${activeConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${activeConversation}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
          scrollToBottom()
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnlineUsers(Object.keys(state))
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id !== currentUserId) {
          setTypingUsers(prev => [...prev, payload.user_id])
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(id => id !== payload.user_id))
          }, 3000)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConversation])

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [])

  async function loadConversations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_participants!inner(user_id),
        chat_messages(
          message_text,
          created_at,
          sender_id
        )
      `)
      .eq('chat_participants.user_id', user.id)
      .order('updated_at', { ascending: false })

    setConversations(data || [])
  }

  async function loadMessages(conversationId: string) {
    const { data } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id(email, full_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    setMessages(data || [])
    scrollToBottom()
  }

  async function sendMessage() {
    if (!newMessage.trim() || !activeConversation) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const message = {
      conversation_id: activeConversation,
      sender_id: user.id,
      message_text: newMessage,
      message_type: 'text'
    }

    const { error } = await supabase
      .from('chat_messages')
      .insert(message)

    if (!error) {
      setNewMessage('')
      // Update conversation updated_at
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversation)
    } else {
      toast.error('Failed to send message')
    }
  }

  function handleTyping() {
    if (!isTyping) {
      setIsTyping(true)
      supabase.channel(`room:${activeConversation}`).send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: currentUserId }
      })
      setTimeout(() => setIsTyping(false), 2000)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function createTaskFromMessage(messageText: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const task = {
      title: messageText.slice(0, 50),
      description: messageText,
      status: 'todo',
      priority: 'medium',
      assigned_to: user.id,
      assigned_by: user.id,
      related_type: 'chat',
      related_id: activeConversation
    }

    const { error } = await supabase.from('tasks').insert(task)
    if (!error) {
      toast.success('Task created from message!')
    }
  }

  const currentUserId = 'current-user-id' // Get from auth context

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? <RiCloseLine size={24} /> : '💬'}
        {/* Unread indicator */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">💬 Team Chat</h3>
                <div className="flex items-center gap-2">
                  <button className="hover:bg-white/20 p-1 rounded">
                    <RiSearchLine size={20} />
                  </button>
                  <button className="hover:bg-white/20 p-1 rounded">
                    <RiMoreLine size={20} />
                  </button>
                </div>
              </div>
              {/* Online Users */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">Online:</span>
                <div className="flex -space-x-2">
                  {onlineUsers.slice(0, 5).map((userId, i) => (
                    <div key={userId} className="w-6 h-6 bg-white/30 rounded-full border-2 border-white/50" />
                  ))}
                  {onlineUsers.length > 5 && (
                    <div className="w-6 h-6 bg-white/30 rounded-full border-2 border-white/50 flex items-center justify-center text-xs">
                      +{onlineUsers.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conversations List / Messages */}
            <div className="flex-1 flex">
              {/* Conversations Sidebar */}
              <div className="w-24 bg-gray-50 border-r overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id)
                      loadMessages(conv.id)
                    }}
                    className={`w-full p-3 hover:bg-gray-100 transition-colors ${
                      activeConversation === conv.id ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-1">
                      <span className="text-white text-xs">👤</span>
                    </div>
                    <span className="text-xs truncate">User</span>
                  </button>
                ))}
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender_id === currentUserId
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      } rounded-2xl px-4 py-2`}>
                        <p className="text-sm">{message.message_text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </span>
                          {message.sender_id === currentUserId && (
                            <RiCheckDoubleLine className={`w-4 h-4 ${message.is_read ? 'text-blue-300' : 'text-gray-300'}`} />
                          )}
                        </div>
                        {/* Create Task Button */}
                        <button
                          onClick={() => createTaskFromMessage(message.message_text)}
                          className="text-xs underline mt-1 opacity-70 hover:opacity-100"
                        >
                          Create Task 📋
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                      <span>Someone is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-3">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-500 hover:text-purple-500">
                      <RiEmotionLine size={20} />
                    </button>
                    <button className="text-gray-500 hover:text-purple-500">
                      <RiAttachment2 size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        handleTyping()
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={sendMessage}
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white"
                    >
                      <RiSendPlaneFill size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}