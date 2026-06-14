import ErrorState from '../../components/common/ErrorState'
import PageHeader from '../../components/common/PageHeader'
import BalanceSummaryCards, { BalanceSummarySkeleton } from '../../components/balances/BalanceSummaryCards'
import { useMyBalances } from '../../hooks/useBalances'
import { normalizeApiError } from '../../utils/helpers'

export default function BalancesPage() {
  const balancesQuery = useMyBalances()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balances"
        description="Track what you owe, what you are owed, and your net balance."
      />

      {balancesQuery.isLoading ? <BalanceSummarySkeleton /> : null}

      {balancesQuery.error ? (
        <ErrorState
          title="Unable to load balance summary"
          message={normalizeApiError(balancesQuery.error).message}
          onRetry={balancesQuery.refetch}
        />
      ) : null}

      {!balancesQuery.isLoading && !balancesQuery.error ? (
        <BalanceSummaryCards summary={balancesQuery.data} />
      ) : null}
    </div>
  )
}
