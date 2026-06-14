import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'

/**
 * Scrollable list of chat messages.
 * @param {Object} props
 * @param {Array} props.messages - Array of chat messages
 * @param {string|number} props.currentUserId - Logged-in user's ID
 * @param {Function} props.onEdit - Edit message callback
 * @param {Function} props.onDelete - Delete message callback
 */
export default function ChatMessageList({ messages = [], currentUserId, onEdit, onDelete }) {
  const scrollContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const isFirstLoad = useRef(true)

  // Scroll behavior: Auto-scroll on new messages, instant on first load
  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
        isFirstLoad.current = false
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages.length])

  const formatDividerDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (date.toDateString() === today.toDateString()) {
        return 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      }
    } catch {
      return ''
    }
  }

  const renderMessages = () => {
    const rendered = []
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      const prevMsg = messages[i - 1]

      // Determine if date changed
      const currentDate = new Date(msg.createdAt)
      const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null

      const isDifferentDay =
        !prevDate ||
        currentDate.getFullYear() !== prevDate.getFullYear() ||
        currentDate.getMonth() !== prevDate.getMonth() ||
        currentDate.getDate() !== prevDate.getDate()

      // Insert Date Divider if day changed
      if (isDifferentDay) {
        rendered.push(
          <div key={`date-${msg.id || i}`} className="flex justify-center my-4 select-none">
            <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {formatDividerDate(msg.createdAt)}
            </span>
          </div>
        )
      }

      // Hide sender name if consecutive messages are from same sender on same day
      const isConsecutive = prevMsg && prevMsg.senderId === msg.senderId && !isDifferentDay

      rendered.push(
        <ChatMessage
          key={msg.id}
          message={msg}
          isSelf={msg.senderId === currentUserId}
          hideSenderName={isConsecutive}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    }
    return rendered
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-2 py-4 space-y-1 bg-slate-50/50"
      style={{ scrollbarWidth: 'thin' }}
    >
      {renderMessages()}
      <div ref={messagesEndRef} />
    </div>
  )
}
