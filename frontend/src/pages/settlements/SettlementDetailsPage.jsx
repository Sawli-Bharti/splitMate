import { useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import PageHeader from '../../components/common/PageHeader'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { Skeleton } from '../../components/ui/skeleton'
import { useGroupBalances } from '../../hooks/useBalances'
import { useSettlement } from '../../hooks/useSettlements'
import { normalizeApiError } from '../../utils/helpers'

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

function getField(item, fields, fallback = '-') {
  const field = fields.find((key) => item?.[key] !== undefined && item?.[key] !== null)
  return field ? item[field] : fallback
}

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

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20" />
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton key={item} className="h-14" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function findRemainingBalance(balances = [], settlement) {
  const payerId = getField(settlement, ['payerId', 'fromUserId'], null)
  const receiverId = getField(settlement, ['receiverId', 'toUserId'], null)

  return balances.find((balance) => (
    String(balance.fromUserId) === String(payerId) &&
    String(balance.toUserId) === String(receiverId)
  ))
}

export default function SettlementDetailsPage() {
  const { settlementId } = useParams()
  const settlementQuery = useSettlement(settlementId)
  const settlement = settlementQuery.data
  const groupId = getField(settlement, ['groupId'], null)
  const balancesQuery = useGroupBalances(groupId)
  const remainingBalance = findRemainingBalance(balancesQuery.data, settlement)

  if (settlementQuery.isLoading) {
    return <DetailsSkeleton />
  }

  if (settlementQuery.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settlement Details" description="Error loading settlement." />
        <ErrorState
          title="Unable to load settlement"
          message={normalizeApiError(settlementQuery.error).message}
          onRetry={settlementQuery.refetch}
        />
      </div>
    )
  }

  if (!settlement) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settlement Details" description="Settlement not found." />
        <EmptyState title="No settlements recorded yet" message="The settlement you're looking for does not exist." />
      </div>
    )
  }

  const settlementDate = getField(settlement, ['settlementDate', 'settledAt', 'createdAt', 'date'], null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlement Details"
        description="Review payment information and remaining balance."
      />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Settlement Information</CardTitle>
              <CardDescription>
                {getField(settlement, ['payerName', 'payer', 'fromUserName'])}
                {' '}paid{' '}
                {getField(settlement, ['receiverName', 'receiver', 'toUserName'])}
              </CardDescription>
            </div>
            <Badge variant="positive">Completed</Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-600">Group</p>
            <p className="mt-1 text-slate-950">{getField(settlement, ['groupName', 'group'])}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Amount</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {formatCurrency(getField(settlement, ['amount', 'settledAmount'], 0))}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Payer</p>
            <p className="mt-1 text-slate-950">{getField(settlement, ['payerName', 'payer', 'fromUserName'])}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Receiver</p>
            <p className="mt-1 text-slate-950">{getField(settlement, ['receiverName', 'receiver', 'toUserName'])}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Settlement Date</p>
            <p className="mt-1 text-slate-950">{formatDate(settlementDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Remaining Balance</p>
            <p className="mt-1 text-slate-950">
              {balancesQuery.isLoading ? 'Loading...' : formatCurrency(remainingBalance?.amount ?? 0)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-slate-600">Note</p>
            <p className="mt-1 text-slate-950">{getField(settlement, ['note'], '-')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
