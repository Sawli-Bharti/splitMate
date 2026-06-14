import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const summaryItems = [
  {
    key: 'youOwe',
    label: 'You Owe',
    tone: 'warning',
    badge: 'Negative',
  },
  {
    key: 'youAreOwed',
    label: 'You Are Owed',
    tone: 'positive',
    badge: 'Positive',
  },
  {
    key: 'netBalance',
    label: 'Net Balance',
    tone: 'balance',
    badge: 'Net',
  },
]

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0))
}

function getBadgeVariant(item, value) {
  if (item.tone === 'positive') {
    return 'positive'
  }

  if (item.tone === 'warning') {
    return 'warning'
  }

  return Number(value ?? 0) >= 0 ? 'positive' : 'warning'
}

export function BalanceSummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryItems.map((item) => (
        <Card key={item.key}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-36" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function BalanceSummaryCards({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {summaryItems.map((item) => {
        const value = summary?.[item.key] ?? 0

        return (
          <Card key={item.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardDescription>{item.label}</CardDescription>
                <Badge variant={getBadgeVariant(item, value)}>
                  {item.key === 'netBalance' ? (value >= 0 ? 'Positive' : 'Negative') : item.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-950">{formatCurrency(value)}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
