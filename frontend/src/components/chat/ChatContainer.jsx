import { useState } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatHeader from './ChatHeader'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'
import EditMessageDialog from './EditMessageDialog'
import ErrorState from '../common/ErrorState'
import EmptyState from '../common/EmptyState'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

/**
 * Loading skeleton for chat messages.
 */
function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/50">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className="space-y-1.5 max-w-[60%] w-full">
            {i % 2 !== 0 && (
              <div className="h-3.5 w-24 bg-slate-200 animate-pulse rounded" />
            )}
            <div
              className={`h-9 bg-slate-200 animate-pulse rounded-2xl ${
                i % 2 === 0 ? 'rounded-br-none ml-auto w-3/4' : 'rounded-bl-none w-2/3'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Chat Container Component.
 * @param {Object} props
 * @param {string|number} props.groupId - The ID of the group
 * @param {string} props.groupName - The name of the group
 */
export default function ChatContainer({ groupId, groupName }) {
  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    connectionStatus,
    isLoading,
    error,
    refetchHistory,
    currentUser,
  } = useChat(groupId)

  const [messageToEdit, setMessageToEdit] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [messageIdToDelete, setMessageIdToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleEditClick = (message) => {
    setMessageToEdit(message)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (messageId) => {
    setMessageIdToDelete(messageId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (messageIdToDelete) {
      deleteMessage(messageIdToDelete)
      setMessageIdToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleEditConfirm = (messageId, newText) => {
    editMessage(messageId, newText)
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <ChatHeader groupName={groupName} connectionStatus="disconnected" groupId={groupId} />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            title="Failed to load chat history"
            message={error.message || 'Could not retrieve message history.'}
            onRetry={refetchHistory}
          />
        </div>
      </div>
    )
  }

  const isOffline = connectionStatus === 'disconnected' || connectionStatus === 'reconnecting'

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <ChatHeader
        groupName={groupName}
        connectionStatus={connectionStatus}
        groupId={groupId}
      />

      {/* Message List / Skeleton / Empty State */}
      {isLoading ? (
        <ChatSkeleton />
      ) : messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50/50 p-6">
          <EmptyState
            title="No messages yet"
            message="Start the conversation! Type a message below."
          />
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          currentUserId={currentUser?.id}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Input bar */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={isLoading || isOffline}
      />

      {/* Edit Message Dialog */}
      <EditMessageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        message={messageToEdit}
        onConfirm={handleEditConfirm}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone and will mark the message as deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
