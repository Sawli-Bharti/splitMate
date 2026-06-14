import { useMemo, useState } from 'react'
import ErrorState from '../../components/common/ErrorState'
import PageHeader from '../../components/common/PageHeader'
import CreateSettlementDialog from '../../components/settlements/CreateSettlementDialog'
import SettlementCard from '../../components/settlements/SettlementCard'
import SettlementHistoryTable, { SettlementHistorySkeleton } from '../../components/settlements/SettlementHistoryTable'
import SettlementSummary, { SettlementSummarySkeleton } from '../../components/settlements/SettlementSummary'
import { Button } from '../../components/ui/button'
import { useMySettlements } from '../../hooks/useSettlements'
import { normalizeApiError } from '../../utils/helpers'

function getSettlementDate(settlement) {
  return settlement?.settlementDate ?? settlement?.settledAt ?? settlement?.createdAt ?? settlement?.date ?? null
}

export default function SettlementsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const settlementsQuery = useMySettlements()

  const settlements = useMemo(() => settlementsQuery.data ?? [], [settlementsQuery.data])
  const recentSettlements = useMemo(() => (
    [...settlements]
      .sort((a, b) => new Date(getSettlementDate(b) ?? 0).getTime() - new Date(getSettlementDate(a) ?? 0).getTime())
      .slice(0, 3)
  ), [settlements])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settlements"
        description="Record payments and review settlement history."
        actions={(
          <Button onClick={() => setCreateDialogOpen(true)}>
            Create Settlement
          </Button>
        )}
      />

      {settlementsQuery.isLoading ? (
        <>
          <SettlementSummarySkeleton />
          <SettlementHistorySkeleton />
        </>
      ) : null}

      {settlementsQuery.error ? (
        <ErrorState
          title="Unable to load settlements"
          message={normalizeApiError(settlementsQuery.error).message}
          onRetry={settlementsQuery.refetch}
        />
      ) : null}

      {!settlementsQuery.isLoading && !settlementsQuery.error ? (
        <>
          <SettlementSummary settlements={settlements} />

          {recentSettlements.length > 0 ? (
            <section className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950">Recent Settlements</h2>
                <p className="text-sm text-slate-500">Latest completed payments.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {recentSettlements.map((settlement, index) => (
                  <SettlementCard key={settlement.id ?? settlement.settlementId ?? index} settlement={settlement} />
                ))}
              </div>
            </section>
          ) : null}

          <SettlementHistoryTable settlements={settlements} />
        </>
      ) : null}

      <CreateSettlementDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
