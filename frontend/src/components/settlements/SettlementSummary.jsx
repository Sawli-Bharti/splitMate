import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0))
}

function getAmount(settlement) {
  return Number(settlement?.amount ?? settlement?.settledAmount ?? 0)
}

export function SettlementSummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <Card key={item}>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function SettlementSummary({ settlements = [] }) {
  const totalAmount = settlements.reduce((sum, settlement) => sum + getAmount(settlement), 0)
  const recentCount = Math.min(settlements.length, 5)

  const cards = [
    { label: 'Total Settlements', value: settlements.length },
    { label: 'Total Amount Settled', value: formatCurrency(totalAmount) },
    { label: 'Recent Settlements', value: recentCount },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-3">
            <CardDescription>{card.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-950">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
