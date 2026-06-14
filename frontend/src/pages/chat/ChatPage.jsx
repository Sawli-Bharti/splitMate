import { useParams } from 'react-router-dom'
import { useGroup } from '../../hooks/useGroups'
import ChatContainer from '../../components/chat/ChatContainer'
import ErrorState from '../../components/common/ErrorState'
import LoadingSpinner from '../../components/common/LoadingSpinner'

/**
 * ChatPage component acting as the route entrypoint for group chats.
 */
export default function ChatPage() {
  const { groupId } = useParams()
  const { data: group, isLoading, error, refetch } = useGroup(groupId)

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-220px)] min-h-[450px] items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="h-8 w-8 text-slate-900" />
          <p className="text-sm font-medium text-slate-500">Loading chat room...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-220px)] min-h-[450px] items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <ErrorState
          title="Could not load group info"
          message={error.message || 'Failed to load group details for this chat room.'}
          onRetry={refetch}
        />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex h-[calc(100vh-220px)] min-h-[450px] items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Group not found</h2>
          <p className="text-slate-600">
            This group does not exist or you do not have permission to view it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-220px)] min-h-[450px] w-full">
      <ChatContainer groupId={groupId} groupName={group.name} />
    </div>
  )
}
