'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, Loader2 } from 'lucide-react'
import MessageBubble from './MessageBubble'

/**
 * ChatSection Component
 * Main chat interface for asking questions about the video
 */
export default function ChatSection({ messages, onSendMessage, isLoading, isVideoLoaded }) {
  // Input state
  const [input, setInput] = useState('')
  
  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Don't send empty messages
    if (!input.trim()) return
    
    // Don't send if no video is loaded
    if (!isVideoLoaded) return
    
    // Send the message
    onSendMessage(input.trim())
    
    // Clear input
    setInput('')
  }

  return (
    <div className="flex flex-col h-[500px] border-t border-border">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-medium text-foreground">Ask Questions</h2>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {isVideoLoaded 
                ? 'Ask anything about the video!'
                : 'Load a video first to start chatting'}
            </p>
          </div>
        ) : (
          // Message list
          <>
            {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                message={msg.text} 
                isUser={msg.isUser} 
                time={msg.time}
              />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (

                <div className="flex justify-start mb-3">

                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-secondary flex items-center gap-2">

                <div className="flex gap-1">

                   <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></span>

                   <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]"></span>

                   <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]"></span>

                </div>

                <p className="text-xs text-muted-foreground">

                    AI is thinking...

                </p>

                </div>

                </div>

            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 border-t border-border"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isVideoLoaded ? "Type your question..." : "Load a video first..."}
            disabled={!isVideoLoaded || isLoading}
            className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isVideoLoaded || isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
