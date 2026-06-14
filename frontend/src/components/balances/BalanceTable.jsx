import EmptyState from '../common/EmptyState'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0))
}

export function BalanceTableSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="grid gap-3 sm:grid-cols-4">
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function BalanceTable({ balances = [] }) {
  const outstandingBalances = balances.filter((balance) => Number(balance.amount ?? 0) > 0)

  if (outstandingBalances.length === 0) {
    return <EmptyState title="No outstanding balances" message="No balances found." />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From User</TableHead>
          <TableHead>To User</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {outstandingBalances.map((balance, index) => (
          <TableRow key={`${balance.fromUserId}-${balance.toUserId}-${index}`}>
            <TableCell className="font-medium text-slate-950">{balance.fromUserName}</TableCell>
            <TableCell>{balance.toUserName}</TableCell>
            <TableCell className="text-right font-medium text-slate-950">
              {formatCurrency(balance.amount)}
            </TableCell>
            <TableCell>
              <Badge variant="warning">Outstanding</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
