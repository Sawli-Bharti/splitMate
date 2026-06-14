import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

/**
 * Message input bar.
 * @param {Object} props
 * @param {Function} props.onSendMessage - Triggered when a message is sent
 * @param {boolean} props.disabled - Whether the input should be disabled
 */
export default function ChatInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim() || disabled) return
    onSendMessage(text.trim())
    setText('')
  }

  return (
    <form
      onSubmit={handleSend}
      className="border-t border-slate-200 bg-white px-4 py-3 flex gap-2 items-center"
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? 'Connecting...' : 'Type a message...'}
        disabled={disabled}
        className="flex-1 focus:ring-1"
        maxLength={1000}
      />
      <Button
        type="submit"
        disabled={disabled || !text.trim()}
        className="h-10 w-10 p-0 flex items-center justify-center shrink-0 rounded-full bg-slate-950 text-white hover:bg-slate-800"
        aria-label="Send message"
      >
        <Send className="h-4.5 w-4.5" />
      </Button>
    </form>
  )
}
