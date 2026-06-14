import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import { Button } from '../ui/button'
import { ROUTES } from '../../constants/routes'

/**
 * Chat Header Component.
 * @param {Object} props
 * @param {string} props.groupName - The name of the group
 * @param {string} props.connectionStatus - WebSocket status: 'connected'|'connecting'|'reconnecting'|'disconnected'
 * @param {string|number} props.groupId - The ID of the group
 */
export default function ChatHeader({ groupName, connectionStatus, groupId }) {
  const navigate = useNavigate()

  const getStatusDetails = () => {
    switch (connectionStatus) {
      case 'connected':
        return { text: 'Online', colorClass: 'bg-emerald-500 text-emerald-700' }
      case 'connecting':
        return { text: 'Connecting...', colorClass: 'bg-amber-500 text-amber-700 animate-pulse' }
      case 'reconnecting':
        return { text: 'Reconnecting...', colorClass: 'bg-amber-600 text-amber-800 animate-pulse' }
      default:
        return { text: 'Offline', colorClass: 'bg-rose-500 text-rose-700' }
    }
  }

  const status = getStatusDetails()

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="h-9 w-9 p-0 rounded-full flex items-center justify-center"
          onClick={() => navigate(`${ROUTES.groups}/${groupId}`)}
        >
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950">{groupName}</h2>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`h-2.5 w-2.5 rounded-full ${status.colorClass.split(' ')[0]}`} />
            <span className="text-xs font-medium text-slate-500">{status.text}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
