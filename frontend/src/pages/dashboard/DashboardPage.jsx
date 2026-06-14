import ErrorState from '../../components/common/ErrorState'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  useDashboardSummary,
  useRecentExpenses,
  useRecentSettlements,
} from '../../hooks/useDashboard'
import { normalizeApiError } from '../../utils/helpers'

const summaryItems = [
  { key: 'totalGroups', label: 'Total Groups', type: 'number' },
  { key: 'totalExpenses', label: 'Total Expenses', type: 'number' },
  { key: 'totalSettlements', label: 'Total Settlements', type: 'number' },
  { key: 'youOwe', label: 'You Owe', type: 'currency', tone: 'warning' },
  { key: 'youAreOwed', label: 'You Are Owed', type: 'currency', tone: 'positive' },
  { key: 'netBalance', label: 'Net Balance', type: 'currency', tone: 'balance' },
]

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0))
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : dateFormatter.format(date)
}

function getField(item, fields, fallback = '-') {
  const field = fields.find((key) => item?.[key] !== undefined && item?.[key] !== null)
  return field ? item[field] : fallback
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryItems.map((item) => (
        <Card key={item.key}>
          <CardHeader className="pb-3">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SummaryCards({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryItems.map((item) => {
        const value = summary?.[item.key] ?? 0
        const isNetBalance = item.key === 'netBalance'
        const badgeVariant =
          item.tone === 'positive' || (isNetBalance && value >= 0)
            ? 'positive'
            : item.tone === 'warning' || (isNetBalance && value < 0)
              ? 'warning'
              : 'secondary'

        return (
          <Card key={item.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardDescription>{item.label}</CardDescription>
                {item.type === 'currency' ? (
                  <Badge variant={badgeVariant}>{isNetBalance ? 'Balance' : 'INR'}</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-950">
                {item.type === 'currency' ? formatCurrency(value) : value}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function TableSkeleton({ columns }) {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="grid gap-3 sm:grid-cols-5">
              {Array.from({ length: columns }).map((_, index) => (
                <div key={index} className="h-4 animate-pulse rounded bg-slate-200" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentExpensesTable({ expenses, isLoading, error, onRetry }) {
  if (isLoading) {
    return <TableSkeleton columns={5} />
  }

  if (error) {
    const apiError = normalizeApiError(error)
    return <ErrorState title="Unable to load recent expenses" message={apiError.message} onRetry={onRetry} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Expenses</CardTitle>
        <CardDescription>Recent expenses across your groups.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-0">
        {expenses.length === 0 ? (
          <div className="py-6">
            <EmptyState title="No recent expenses" message="Expenses will appear here once they are added." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Group</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell">Paid By</TableHead>
                <TableHead className="hidden lg:table-cell">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => {
                const amount = getField(expense, ['amount', 'totalAmount'])
                return (
                  <TableRow key={expense.id ?? expense.expenseId ?? index}>
                    <TableCell className="font-medium text-slate-950">
                      {getField(expense, ['title', 'description', 'name'])}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-600">{getField(expense, ['groupName', 'group'])}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(amount)}</TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600">{getField(expense, ['paidByName', 'paidBy', 'payerName'])}</TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-500 text-sm">{formatDate(getField(expense, ['createdAt', 'date']))}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function RecentSettlementsTable({ settlements, isLoading, error, onRetry }) {
  if (isLoading) {
    return <TableSkeleton columns={4} />
  }

  if (error) {
    const apiError = normalizeApiError(error)
    return <ErrorState title="Unable to load recent settlements" message={apiError.message} onRetry={onRetry} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Settlements</CardTitle>
        <CardDescription>Recent payments between members.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-0">
        {settlements.length === 0 ? (
          <div className="py-6">
            <EmptyState title="No recent settlements" message="Settlements will appear here once they are recorded." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer</TableHead>
                <TableHead className="hidden sm:table-cell">Receiver</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map((settlement, index) => {
                const amount = getField(settlement, ['amount', 'settledAmount'])
                return (
                  <TableRow key={settlement.id ?? settlement.settlementId ?? index}>
                    <TableCell className="font-medium text-slate-950">
                      {getField(settlement, ['payerName', 'payer', 'paidByName'])}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-600">{getField(settlement, ['receiverName', 'receiver', 'receivedByName'])}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(amount)}</TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-sm">{formatDate(getField(settlement, ['date', 'createdAt', 'settledAt']))}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const summaryQuery = useDashboardSummary()
  const expensesQuery = useRecentExpenses()
  const settlementsQuery = useRecentSettlements()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="A quick view of your groups, balances, recent expenses, and settlements."
      />

      {summaryQuery.isLoading ? <SummarySkeleton /> : null}

      {summaryQuery.error ? (
        <ErrorState
          title="Unable to load dashboard summary"
          message={normalizeApiError(summaryQuery.error).message}
          onRetry={summaryQuery.refetch}
        />
      ) : null}

      {!summaryQuery.isLoading && !summaryQuery.error ? (
        <SummaryCards summary={summaryQuery.data} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentExpensesTable
          expenses={expensesQuery.data ?? []}
          error={expensesQuery.error}
          isLoading={expensesQuery.isLoading}
          onRetry={expensesQuery.refetch}
        />
        <RecentSettlementsTable
          settlements={settlementsQuery.data ?? []}
          error={settlementsQuery.error}
          isLoading={settlementsQuery.isLoading}
          onRetry={settlementsQuery.refetch}
        />
      </div>
    </div>
  )
}
