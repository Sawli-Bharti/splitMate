import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import PageHeader from '../components/common/PageHeader'
import MemberList from '../components/groups/MemberList'
import AddMemberDialog from '../components/groups/AddMemberDialog'
import BalanceGroupView from '../components/balances/BalanceGroupView'
import EditGroupDialog from '../components/groups/EditGroupDialog'
import ExpenseList from '../components/expenses/ExpenseList'
import CreateExpenseDialog from '../components/expenses/CreateExpenseDialog'
import SettlementHistoryTable, { SettlementHistorySkeleton } from '../components/settlements/SettlementHistoryTable'
import { showToast } from '../utils/toast'
import { ROUTES } from '../constants/routes'
import { normalizeApiError } from '../utils/helpers'
import { useGroup, useDeleteGroup } from '../hooks/useGroups'
import { useExpensesByGroup, useDeleteExpense } from '../hooks/useExpenses'
import { useGroupSettlements } from '../hooks/useSettlements'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function GroupSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  )
}

export default function GroupDetailsPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { data: group, isLoading, error, refetch } = useGroup(groupId)
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useExpensesByGroup(groupId)
  const settlementsQuery = useGroupSettlements(groupId)
  const deleteGroup = useDeleteGroup()
  const deleteExpense = useDeleteExpense()

  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createExpenseDialogOpen, setCreateExpenseDialogOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(null)

  const handleDeleteConfirm = async () => {
    try {
      await deleteGroup.mutateAsync(groupId)
      showToast({
        type: 'success',
        title: 'Group deleted',
        message: 'Group has been deleted successfully.',
      })
      navigate(ROUTES.groups)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to delete group',
        message: error?.response?.data?.message ?? 'Unable to delete group',
      })
    }
  }

  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense)
  }

  const handleDeleteExpenseConfirm = async () => {
    try {
      await deleteExpense.mutateAsync(expenseToDelete.id)
      showToast({
        type: 'success',
        title: 'Expense deleted',
        message: 'Expense has been deleted successfully.',
      })
      setExpenseToDelete(null)
      refetchExpenses()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to delete expense',
        message: error?.response?.data?.message ?? 'Unable to delete expense',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Group Details" description="Loading..." />
        <GroupSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Group Details" description="Error loading group" />
        <ErrorState onRetry={() => refetch()} />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="space-y-6">
        <PageHeader title="Group Details" description="Group not found" />
        <EmptyState title="Group not found" message="The group you're looking for doesn't exist." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={group.name}
        description={group.description || 'Group details'}
        actions={
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => navigate(ROUTES.chat.replace(':groupId', groupId))} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
            <Button variant="secondary" onClick={() => setEditDialogOpen(true)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </Button>
          </div>
        }
      />

      {/* Group Info */}
      <Card>
        <CardHeader>
          <CardTitle>Group Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-600">Group Name</p>
            <p className="text-lg font-semibold text-slate-950">{group.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Description</p>
            <p className="text-slate-700">{group.description || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Members</p>
              <p className="text-2xl font-semibold text-slate-950">{group.members?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Created</p>
              <p className="text-slate-700">{formatDate(group.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>Group members and their roles</CardDescription>
          </div>
          <Button onClick={() => setAddMemberDialogOpen(true)}>
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <MemberList groupId={groupId} members={group.members || []} />
        </CardContent>
      </Card>

      <Separator />

      {/* Balances */}
      <BalanceGroupView groupId={groupId} />

      <Separator />

      {/* Settlements */}
      {settlementsQuery.isLoading ? (
        <SettlementHistorySkeleton />
      ) : settlementsQuery.error ? (
        <ErrorState
          title="Unable to load settlements"
          message={normalizeApiError(settlementsQuery.error).message}
          onRetry={settlementsQuery.refetch}
        />
      ) : (
        <SettlementHistoryTable settlements={settlementsQuery.data ?? []} />
      )}

      <Separator />

      {/* Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Group expenses and splits</CardDescription>
          </div>
          <Button onClick={() => setCreateExpenseDialogOpen(true)}>
            Create Expense
          </Button>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={expenses}
            isLoading={expensesLoading}
            error={expensesError}
            onDelete={handleDeleteExpense}
            onView={(expense) => navigate(`${ROUTES.groups}/${groupId}/expenses/${expense.id}`)}
            onRetry={refetchExpenses}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditGroupDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} group={group} />
      <AddMemberDialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen} groupId={groupId} />
      <CreateExpenseDialog open={createExpenseDialogOpen} onOpenChange={setCreateExpenseDialogOpen} groupId={groupId} members={group.members || []} />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{group.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
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

      {/* Delete Expense Confirmation */}
      <AlertDialog open={!!expenseToDelete} onOpenChange={() => setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{expenseToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpenseConfirm}
              disabled={deleteExpense.isPending}
            >
              {deleteExpense.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
