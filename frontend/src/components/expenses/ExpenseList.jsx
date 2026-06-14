import EmptyState from '../../components/common/EmptyState'
import ExpenseCard from './ExpenseCard'

export default function ExpenseList({ expenses = [], isLoading, error, onDelete, onView, onRetry }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-950">Failed to load expenses</h3>
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!expenses || expenses.length === 0) {
    return <EmptyState title="No expenses yet" message="Create your first expense to get started." />
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  )
}
