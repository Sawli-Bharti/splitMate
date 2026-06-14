import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit3, Trash2 } from 'lucide-react'

/**
 * Renders an individual chat message bubble.
 * @param {Object} props
 * @param {Object} props.message - The message object
 * @param {boolean} props.isSelf - Whether this message was sent by the current user
 * @param {Function} props.onEdit - Edit message trigger
 * @param {Function} props.onDelete - Delete message trigger (arguments: messageId)
 */
export default function ChatMessage({ message, isSelf, onEdit, onDelete, hideSenderName }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Close context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} group max-w-full relative px-4 py-1`}>
      {/* Sender name for messages from other users */}
      {!isSelf && !hideSenderName && (
        <span className="text-xs font-semibold text-slate-500 mb-0.5 ml-1 select-none">
          {message.senderName}
        </span>
      )}

      <div className={`flex items-center gap-2 max-w-[85%] sm:max-w-[70%] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2 text-sm shadow-sm transition-all duration-200 relative break-words whitespace-pre-wrap select-text ${
            message.isDeleted
              ? 'bg-slate-100 text-slate-400 border border-slate-200 italic rounded-2xl'
              : isSelf
              ? 'bg-slate-950 text-white rounded-br-none'
              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
          }`}
        >
          <div>{message.message}</div>

          {/* Time & Badges footer */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
              isSelf ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {message.isEdited && !message.isDeleted && (
              <span className="font-medium opacity-85">• Edited</span>
            )}
            {message.isDeleted && (
              <span className="font-medium opacity-85">• Deleted</span>
            )}
          </div>
        </div>

        {/* Options Menu (visible on hover for sender when not deleted) */}
        {isSelf && !message.isDeleted && (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
              aria-label="Message options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 bottom-full mb-1.5 z-30 w-28 bg-white border border-slate-200 rounded-lg shadow-md py-1">
                <button
                  onClick={() => {
                    onEdit(message)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(message.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
