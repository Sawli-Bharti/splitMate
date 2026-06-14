import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ROUTES } from '../../constants/routes'

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

export default function SettlementCard({ settlement }) {
  const navigate = useNavigate()
  const settlementId = getField(settlement, ['id', 'settlementId'], null)

  return (
    <Card
      className="cursor-pointer transition hover:border-slate-300 hover:shadow"
      onClick={() => settlementId && navigate(ROUTES.settlementDetails.replace(':settlementId', settlementId))}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>
              {getField(settlement, ['payerName', 'payer', 'fromUserName'])}
              {' '}paid{' '}
              {getField(settlement, ['receiverName', 'receiver', 'toUserName'])}
            </CardTitle>
            <CardDescription>{getField(settlement, ['groupName', 'group'])}</CardDescription>
          </div>
          <Badge variant="positive">Completed</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xl font-semibold text-slate-950">
          {formatCurrency(getField(settlement, ['amount', 'settledAmount'], 0))}
        </p>
        <p className="text-sm text-slate-500">
          {formatDate(getField(settlement, ['settlementDate', 'settledAt', 'createdAt', 'date'], null))}
        </p>
      </CardContent>
    </Card>
  )
}
