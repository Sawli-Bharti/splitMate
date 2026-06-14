import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

/**
 * Dialog to edit an existing chat message.
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onOpenChange - Open state change handler
 * @param {Object} props.message - The message object being edited
 * @param {Function} props.onConfirm - Callback to edit message (arguments: messageId, newText)
 */
export default function EditMessageDialog({ open, onOpenChange, message, onConfirm }) {
  const [editText, setEditText] = useState('')
  const [prevMessage, setPrevMessage] = useState(null)

  if (message !== prevMessage) {
    setPrevMessage(message)
    setEditText(message ? message.message : '')
  }

  const handleSave = () => {
    if (!editText.trim() || !message) return
    onConfirm(message.id, editText.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium text-slate-700" htmlFor="edit-message-input">
            Message
          </label>
          <Input
            id="edit-message-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
            placeholder="Edit your message..."
            className="mt-2"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!editText.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
