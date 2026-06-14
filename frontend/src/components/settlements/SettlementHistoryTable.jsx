import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../common/EmptyState'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
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

function getSettlementDate(settlement) {
  return getField(settlement, ['settlementDate', 'settledAt', 'createdAt', 'date'], null)
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

export function SettlementHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid gap-3 md:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((cell) => (
                <Skeleton key={cell} className="h-5" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function SettlementHistoryTable({ settlements = [] }) {
  const navigate = useNavigate()
  const [userSearch, setUserSearch] = useState('')
  const [groupSearch, setGroupSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  const filteredSettlements = useMemo(() => {
    const normalizedUserSearch = userSearch.trim().toLowerCase()
    const normalizedGroupSearch = groupSearch.trim().toLowerCase()

    return [...settlements]
      .filter((settlement) => {
        const payer = String(getField(settlement, ['payerName', 'payer', 'fromUserName'], '')).toLowerCase()
        const receiver = String(getField(settlement, ['receiverName', 'receiver', 'toUserName'], '')).toLowerCase()
        const group = String(getField(settlement, ['groupName', 'group'], '')).toLowerCase()

        const userMatches = !normalizedUserSearch || payer.includes(normalizedUserSearch) || receiver.includes(normalizedUserSearch)
        const groupMatches = !normalizedGroupSearch || group.includes(normalizedGroupSearch)

        return userMatches && groupMatches
      })
      .sort((a, b) => {
        const first = new Date(getSettlementDate(a) ?? 0).getTime()
        const second = new Date(getSettlementDate(b) ?? 0).getTime()

        return sortOrder === 'newest' ? second - first : first - second
      })
  }, [groupSearch, settlements, sortOrder, userSearch])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement History</CardTitle>
        <CardDescription>Completed settlement records across your groups.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-5 pt-6">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_180px]">
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="settlement-user-search">
              Search by User
            </label>
            <Input
              id="settlement-user-search"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Payer or receiver"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="settlement-group-search">
              Search by Group
            </label>
            <Input
              id="settlement-group-search"
              value={groupSearch}
              onChange={(event) => setGroupSearch(event.target.value)}
              placeholder="Group name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="settlement-sort">
              Date Sorting
            </label>
            <Select
              id="settlement-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
          </div>
        </div>

        {settlements.length === 0 ? (
          <EmptyState title="No settlements recorded yet" message="No settlements found." />
        ) : filteredSettlements.length === 0 ? (
          <EmptyState title="No settlements recorded yet" message="No settlements match the current filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead className="hidden md:table-cell">Group</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.map((settlement, index) => {
                const settlementId = getField(settlement, ['id', 'settlementId'], null)

                return (
                  <TableRow
                    key={settlementId ?? index}
                    className="cursor-pointer"
                    onClick={() => settlementId && navigate(ROUTES.settlementDetails.replace(':settlementId', settlementId))}
                  >
                    <TableCell className="font-medium text-slate-950">
                      {getField(settlement, ['payerName', 'payer', 'fromUserName'])}
                    </TableCell>
                    <TableCell>{getField(settlement, ['receiverName', 'receiver', 'toUserName'])}</TableCell>
                    <TableCell className="hidden md:table-cell">{getField(settlement, ['groupName', 'group'])}</TableCell>
                    <TableCell className="text-right font-medium text-slate-950">
                      {formatCurrency(getField(settlement, ['amount', 'settledAmount'], 0))}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-slate-500">
                      {formatDate(getSettlementDate(settlement))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="positive">Completed</Badge>
                    </TableCell>
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
