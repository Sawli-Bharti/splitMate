import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import PageHeader from '../components/common/PageHeader'
import ErrorState from '../components/common/ErrorState'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog'
import { showToast } from '../utils/toast'
import { useGroups, useDeleteGroup } from '../hooks/useGroups'
import GroupCard from '../components/groups/GroupCard'
import CreateGroupDialog from '../components/groups/CreateGroupDialog'
import EditGroupDialog from '../components/groups/EditGroupDialog'

function GroupSkeleton() {
  return (
    <Card className="h-64 animate-pulse">
      <div className="h-full bg-slate-200" />
    </Card>
  )
}

export default function GroupPage() {
  const { data: groups = [], isLoading, error, refetch } = useGroups()
  const deleteGroup = useDeleteGroup()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [groupToDelete, setGroupToDelete] = useState(null)

  const handleEdit = (group) => {
    setEditingGroup(group)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (group) => {
    setGroupToDelete(group)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteGroup.mutateAsync(groupToDelete.id)
      showToast({
        type: 'success',
        title: 'Group deleted',
        message: 'Group has been deleted successfully.',
      })
      setGroupToDelete(null)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to delete group',
        message: error?.response?.data?.message ?? 'Unable to delete group',
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Groups"
        description="Manage your expense sharing groups."
        actions={
          <Button onClick={() => setCreateDialogOpen(true)}>
            Create Group
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <GroupSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : null}

      {!isLoading && groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-950">Create your first group</h3>
          <p className="mt-2 text-slate-600">
            Groups help you organize and track expenses with friends and family.
          </p>
          <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
            Create Group
          </Button>
        </div>
      ) : null}

      {!isLoading && groups.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : null}

      <CreateGroupDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <EditGroupDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} group={editingGroup} />

      <AlertDialog open={!!groupToDelete} onOpenChange={() => setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{groupToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGroupToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteGroup.isPending}
            >
              {deleteGroup.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
