import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog'
import PageHeader from '../../components/common/PageHeader'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import { showToast } from '../../utils/toast'
import { ROUTES } from '../../constants/routes'
import { useExpense, useDeleteExpense } from '../../hooks/useExpenses'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const splitTypeColors = {
  EQUAL: 'secondary',
  UNEQUAL: 'default',
  PERCENTAGE: 'positive',
  SHARE: 'warning',
}

function ExpenseSkeleton() {
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

export default function ExpenseDetailsPage() {
  const { expenseId } = useParams()
  const navigate = useNavigate()
  const { data: expense, isLoading, error, refetch } = useExpense(expenseId)
  const deleteExpense = useDeleteExpense()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteConfirm = async () => {
    try {
      await deleteExpense.mutateAsync(expenseId)
      showToast({
        type: 'success',
        title: 'Expense deleted',
        message: 'Expense has been deleted successfully.',
      })
      setShowDeleteConfirm(false)
      navigate(ROUTES.groups)
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
        <PageHeader title="Expense Details" description="Loading..." />
        <ExpenseSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Expense Details" description="Error loading expense" />
        <ErrorState onRetry={() => refetch()} />
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="space-y-6">
        <PageHeader title="Expense Details" description="Not found" />
        <EmptyState title="Expense not found" message="The expense you're looking for doesn't exist." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={expense.title}
        description={expense.description || 'Expense details'}
        actions={
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </Button>
        }
      />

      {/* Expense Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>Created {formatDate(expense.createdAt)}</CardDescription>
            </div>
            <Badge variant={splitTypeColors[expense.splitType] || 'default'}>
              {expense.splitType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Amount</p>
              <p className="text-2xl font-semibold text-slate-950">{formatCurrency(expense.amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Paid By</p>
              <p className="text-lg text-slate-950">{expense.paidByName}</p>
            </div>
          </div>
          {expense.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600">Description</p>
                <p className="mt-2 text-slate-700">{expense.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({expense.participants?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expense.participants?.map((participant) => (
              <div key={participant.userId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-slate-950">{participant.participantName}</p>
                  <p className="text-sm text-slate-600">{participant.splitType}</p>
                </div>
                <div className="text-right">
                  {participant.splitType === 'EQUAL' ? (
                    <p className="font-semibold text-slate-950">
                      {formatCurrency(expense.amount / (expense.participants?.length || 1))}
                    </p>
                  ) : participant.splitType === 'UNEQUAL' ? (
                    <p className="font-semibold text-slate-950">{formatCurrency(participant.amount || 0)}</p>
                  ) : participant.splitType === 'PERCENTAGE' ? (
                    <>
                      <p className="font-semibold text-slate-950">
                        {formatCurrency((expense.amount * (participant.percentage || 0)) / 100)}
                      </p>
                      <p className="text-xs text-slate-600">{participant.percentage || 0}%</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-950">{participant.shares || 0} shares</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Balances */}
      {expense.generatedBalances && expense.generatedBalances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Balances</CardTitle>
            <CardDescription>Who owes whom based on this expense</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expense.generatedBalances.map((balance, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div>
                    <p className="text-sm text-slate-950">
                      <span className="font-semibold">{balance.debtor}</span>
                      {' '}owes{' '}
                      <span className="font-semibold">{balance.creditor}</span>
                    </p>
                  </div>
                  <p className="font-semibold text-amber-900">{formatCurrency(balance.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{expense.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
