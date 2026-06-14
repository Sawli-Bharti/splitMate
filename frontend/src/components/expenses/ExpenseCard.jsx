import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

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

export default function ExpenseCard({ expense, onDelete, onView }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{expense.title}</CardTitle>
            <CardDescription className="line-clamp-1 mt-1">{expense.description}</CardDescription>
          </div>
          <Badge variant={splitTypeColors[expense.splitType] || 'default'}>
            {expense.splitType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">Amount</span>
          <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">Paid By</span>
          <span className="text-slate-950">{expense.paidByName}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>{expense.participants?.length} participants</span>
          <span>{formatDate(expense.createdAt)}</span>
        </div>
      </CardContent>
      <div className="border-t border-slate-200 p-4 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => onView?.(expense)}>
          View
        </Button>
        <Button variant="destructive" onClick={() => onDelete?.(expense)}>
          Delete
        </Button>
      </div>
    </Card>
  )
}
