import ErrorState from '../common/ErrorState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { useGroupBalances } from '../../hooks/useBalances'
import { normalizeApiError } from '../../utils/helpers'
import BalanceTable, { BalanceTableSkeleton } from './BalanceTable'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0))
}

function BalanceSentences({ balances }) {
  const outstandingBalances = balances.filter((balance) => Number(balance.amount ?? 0) > 0)

  if (outstandingBalances.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {outstandingBalances.map((balance, index) => (
        <p key={`${balance.fromUserId}-${balance.toUserId}-sentence-${index}`} className="text-sm text-slate-700">
          <span className="font-medium text-slate-950">{balance.fromUserName}</span>
          {' '}owes{' '}
          <span className="font-medium text-slate-950">{balance.toUserName}</span>
          {' '}
          <span className="font-semibold text-slate-950">{formatCurrency(balance.amount)}</span>
        </p>
      ))}
    </div>
  )
}

export default function BalanceGroupView({ groupId }) {
  const balancesQuery = useGroupBalances(groupId)

  if (balancesQuery.isLoading) {
    return <BalanceTableSkeleton />
  }

  if (balancesQuery.error) {
    const apiError = normalizeApiError(balancesQuery.error)
    return (
      <ErrorState
        title="Unable to load balances"
        message={apiError.message}
        onRetry={balancesQuery.refetch}
      />
    )
  }

  const balances = balancesQuery.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balances</CardTitle>
        <CardDescription>Outstanding balances for this group.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-5 pt-6">
        <BalanceSentences balances={balances} />
        <BalanceTable balances={balances} />
      </CardContent>
    </Card>
  )
}
