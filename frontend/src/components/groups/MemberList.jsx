import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog'
import { showToast } from '../../utils/toast'
import { useRemoveMember } from '../../hooks/useGroups'
import EmptyState from '../../components/common/EmptyState'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MemberList({ groupId, members = [] }) {
  const removeMember = useRemoveMember()
  const [memberToRemove, setMemberToRemove] = useState(null)

  const handleRemoveConfirm = async () => {
    try {
      await removeMember.mutateAsync({
        groupId,
        userId: memberToRemove.id,
      })
      showToast({
        type: 'success',
        title: 'Member removed',
        message: 'Member has been removed from the group.',
      })
      setMemberToRemove(null)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to remove member',
        message: error?.response?.data?.message ?? 'Unable to remove member',
      })
    }
  }

  if (!members || members.length === 0) {
    return <EmptyState title="No members" message="Add members to this group." />
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-slate-600">{member.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {member.role || 'Member'}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-slate-500 text-sm">
                  {member.joinedAt ? formatDate(member.joinedAt) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setMemberToRemove(member)}
                    disabled={removeMember.isPending}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} from this group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToRemove(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              disabled={removeMember.isPending}
            >
              {removeMember.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
