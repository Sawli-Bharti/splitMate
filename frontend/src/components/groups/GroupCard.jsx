import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function GroupCard({ group, onEdit, onDelete }) {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{group.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{group.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Members</p>
            <p className="text-lg font-semibold text-slate-950">{group.memberCount ?? 0}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Created</p>
            <p className="text-sm font-medium text-slate-700">{formatDate(group.createdAt)}</p>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-slate-200 p-4 flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => navigate(ROUTES.groupDetails.replace(':groupId', group.id))}
        >
          View
        </Button>
        <Button variant="secondary" onClick={() => onEdit?.(group)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete?.(group)}>
          Delete
        </Button>
      </div>
    </Card>
  )
}
