import React, { useState, useRef, useEffect } from 'react'
import { useJanSamvad } from '../context/JanSamvadContext'
import { MessageSquare, Send, X, Sparkles, Bot, User, CornerDownLeft } from 'lucide-react'
import api from '../services/api'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: Date
}

export default function AiAssistantWidget() {
  const { askLocalAssistant, currentUser } = useJanSamvad()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your JanSamvad Civic Assistant. 🏛️\n\nAsk me questions about projects, budgets, or grievances in your district. I only use verified platform records and will never invent information.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat history when messages change or open
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    setInput('')
    
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    // Simulate thinking/typing animation delay
    setTimeout(async () => {
      let replyText = ''

      try {
        // Try calling the real API backend assistant endpoint first
        const token = localStorage.getItem('token')
        if (token) {
          const res = await api.post('/api/complaints/assistant/chat', { message: userText })
          if (res.data?.success && res.data?.reply) {
            replyText = res.data.reply
          }
        }
      } catch (err) {
        console.warn('API chatbot error, falling back to local heuristic search:', err)
      }

      // If backend reply is empty (offline/prototype mode), run local context search
      if (!replyText) {
        replyText = askLocalAssistant(userText)
      }

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMsg])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white hover:scale-105 cursor-pointer relative"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border border-white flex items-center justify-center text-[8px] font-black text-white">
            AI
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight">JanSamvad AI Assistant</h3>
                <div className="text-[9px] text-blue-100 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Verified District Data QA
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-tr from-slate-900 to-indigo-950'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line border shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none'
                      : 'bg-white text-slate-800 border-slate-200 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about water cuts, roads, or JS-2026-000100..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
