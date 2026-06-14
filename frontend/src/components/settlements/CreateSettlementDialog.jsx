import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Skeleton } from '../ui/skeleton'
import { Textarea } from '../ui/textarea'
import { useGroup, useGroups } from '../../hooks/useGroups'
import { useGroupBalances } from '../../hooks/useBalances'
import { useCreateSettlement } from '../../hooks/useSettlements'
import { showToast } from '../../utils/toast'
import { zodResolver } from '../../utils/zodResolver'

const settlementSchema = z.object({
  groupId: z.string().min(1, 'Group is required'),
  payerId: z.string().min(1, 'Payer is required'),
  receiverId: z.string().min(1, 'Receiver is required'),
  amount: z.number().min(0.01, 'Amount must be greater than zero'),
  note: z.string().optional().default(''),
}).superRefine((values, context) => {
  if (values.payerId && values.receiverId && values.payerId === values.receiverId) {
    context.addIssue({
      code: 'custom',
      message: 'Payer and receiver cannot be same',
      path: ['receiverId'],
    })
  }
})

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0))
}

function getId(value) {
  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? value : numericValue
}

function normalizeMember(member) {
  return {
    id: member?.userId ?? member?.id ?? member?.memberId,
    name: member?.name ?? member?.userName ?? member?.memberName ?? member?.email ?? 'Unknown member',
  }
}

function findOutstandingDebt(balances = [], payerId, receiverId) {
  console.log('selected payer:', payerId)
  console.log('selected receiver:', receiverId)
  console.log('group balances:', balances)
  const matched = (balances ?? []).find((balance) => (
    Number(balance.fromUserId) === Number(payerId) &&
    Number(balance.toUserId) === Number(receiverId) &&
    Number(balance.amount ?? 0) > 0
  ))
  console.log('matched balance:', matched)
  return matched
}

export default function CreateSettlementDialog({ open, onOpenChange }) {
  const [settlementError, setSettlementError] = useState('')
  const groupsQuery = useGroups()
  const createSettlement = useCreateSettlement()

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      groupId: '',
      payerId: '',
      receiverId: '',
      amount: 0,
      note: '',
    },
    resolver: zodResolver(settlementSchema),
  })

  const selectedGroupId = useWatch({ control, name: 'groupId' })
  const selectedPayerId = useWatch({ control, name: 'payerId' })
  const selectedReceiverId = useWatch({ control, name: 'receiverId' })
  const amount = useWatch({ control, name: 'amount' })

  const groupQuery = useGroup(selectedGroupId)
  const balancesQuery = useGroupBalances(selectedGroupId)

  const members = (groupQuery.data?.members ?? []).map(normalizeMember).filter((member) => member.id !== undefined && member.id !== null)
  const outstandingDebt = findOutstandingDebt(balancesQuery.data, selectedPayerId, selectedReceiverId)
  const outstandingAmount = Number(outstandingDebt?.amount ?? 0)
  const hasSelectedPair = Boolean(selectedPayerId && selectedReceiverId && selectedPayerId !== selectedReceiverId)

  const resetDialog = () => {
    reset()
    setSettlementError('')
  }

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      resetDialog()
    }

    onOpenChange(nextOpen)
  }

  const onSubmit = async (values) => {
    const debt = findOutstandingDebt(balancesQuery.data, values.payerId, values.receiverId)
    const debtAmount = Number(debt?.amount ?? 0)

    if (!debt || debtAmount <= 0) {
      setSettlementError('No outstanding balance exists between these users')
      return
    }

    if (values.amount > debtAmount) {
      setSettlementError('Settlement amount exceeds outstanding balance')
      return
    }

    setSettlementError('')

    try {
      await createSettlement.mutateAsync({
        groupId: getId(values.groupId),
        payerId: getId(values.payerId),
        receiverId: getId(values.receiverId),
        amount: values.amount,
        note: values.note ?? '',
      })

      showToast({
        type: 'success',
        title: 'Settlement recorded successfully',
        message: 'Settlement recorded successfully',
      })
      resetDialog()
      onOpenChange(false)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to record settlement',
        message: error?.response?.data?.message ?? 'Unable to record settlement',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto space-y-4">
        <DialogHeader>
          <DialogTitle>Create Settlement</DialogTitle>
          <DialogDescription>Record a payment made between group members.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="settlement-group">
              Group
            </label>
            <Select id="settlement-group" disabled={groupsQuery.isLoading} {...register('groupId')}>
              <option value="">Select group</option>
              {(groupsQuery.data ?? []).map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
            {errors.groupId && <p className="mt-2 text-sm text-red-600">{errors.groupId.message}</p>}
          </div>

          {selectedGroupId && groupQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-800" htmlFor="settlement-payer">
                Payer
              </label>
              <Select id="settlement-payer" disabled={!selectedGroupId || groupQuery.isLoading} {...register('payerId')}>
                <option value="">Select payer</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
              {errors.payerId && <p className="mt-2 text-sm text-red-600">{errors.payerId.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800" htmlFor="settlement-receiver">
                Receiver
              </label>
              <Select id="settlement-receiver" disabled={!selectedGroupId || groupQuery.isLoading} {...register('receiverId')}>
                <option value="">Select receiver</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
              {errors.receiverId && <p className="mt-2 text-sm text-red-600">{errors.receiverId.message}</p>}
            </div>
          </div>

          {hasSelectedPair ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-800">Outstanding Debt</p>
              {balancesQuery.isLoading ? (
                <Skeleton className="mt-3 h-5 w-48" />
              ) : outstandingDebt ? (
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">{outstandingDebt.fromUserName}</span>
                  {' '}owes{' '}
                  <span className="font-semibold text-slate-950">{outstandingDebt.toUserName}</span>
                  {' '}
                  <span className="font-semibold text-slate-950">{formatCurrency(outstandingAmount)}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-red-600">No outstanding balance exists between these users</p>
              )}
            </div>
          ) : null}

          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="settlement-amount">
              Amount
            </label>
            <Input
              id="settlement-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>}
            {hasSelectedPair && outstandingDebt && Number(amount ?? 0) > outstandingAmount ? (
              <p className="mt-2 text-sm text-red-600">Settlement amount exceeds outstanding balance</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="settlement-note">
              Note
            </label>
            <Textarea
              id="settlement-note"
              placeholder="e.g., Paid through UPI"
              {...register('note')}
            />
          </div>

          {settlementError ? (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {settlementError}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createSettlement.isPending || balancesQuery.isLoading}>
              {isSubmitting || createSettlement.isPending ? 'Recording...' : 'Create Settlement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
