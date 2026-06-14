import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { zodResolver } from '../../utils/zodResolver'
import { showToast } from '../../utils/toast'
import { useCreateExpense } from '../../hooks/useExpenses'
import SplitTypeSelector from './SplitTypeSelector'
import ExpenseParticipantsTable from './ExpenseParticipantsTable'

const createExpenseSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional().default(''),
  amount: z.number()
    .min(0.01, 'Amount must be greater than zero'),
  // FIX: renamed paidById -> paidByUserId to match backend DTO field name
  paidByUserId: z.string().min(1, 'Please select who paid'),
})

export default function CreateExpenseDialog({ open, onOpenChange, groupId, members = [] }) {
  const createExpense = useCreateExpense()
  const [splitType, setSplitType] = useState('EQUAL')
  const [selectedParticipants, setSelectedParticipants] = useState([])
  // FIX: splits keyed by member.userId (the actual User PK Long)
  const [splits, setSplits] = useState({})
  const [splitError, setSplitError] = useState('')

  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      // FIX: field name matches backend DTO
      paidByUserId: '',
    },
    resolver: zodResolver(createExpenseSchema),
  })

  const amount = useWatch({ control, name: 'amount' })

  const resetDialogState = () => {
    reset()
    setSelectedParticipants([])
    setSplits({})
    setSplitError('')
    setSplitType('EQUAL')
  }

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      resetDialogState()
    }
    onOpenChange(nextOpen)
  }

  const toggleParticipant = (member) => {
    setSelectedParticipants((prev) => {
      // FIX: use member.userId (User PK) as unique key, NOT member.id (GroupMember row ID)
      const isSelected = prev.find((p) => p.userId === member.userId)
      if (isSelected) {
        const newParticipants = prev.filter((p) => p.userId !== member.userId)
        const newSplits = { ...splits }
        delete newSplits[member.userId]
        setSplits(newSplits)
        return newParticipants
      } else {
        return [...prev, member]
      }
    })
  }

  const handleSplitChange = (participantUserId, value) => {
    setSplits((prev) => ({
      ...prev,
      [participantUserId]: value,
    }))
    setSplitError('')
  }

  const validateSplits = () => {
    if (selectedParticipants.length === 0) {
      setSplitError('Please select at least one participant')
      return false
    }

    if (splitType === 'EQUAL') {
      return true
    }

    if (splitType === 'UNEQUAL') {
      // FIX: sum over p.userId keys
      const total = selectedParticipants.reduce((sum, p) => sum + (splits[p.userId] || 0), 0)
      if (Math.abs(total - amount) > 0.01) {
        setSplitError(`Sum must equal ${amount.toFixed(2)}. Current sum: ${total.toFixed(2)}`)
        return false
      }
    }

    if (splitType === 'PERCENTAGE') {
      const total = selectedParticipants.reduce((sum, p) => sum + (splits[p.userId] || 0), 0)
      if (Math.abs(total - 100) > 0.01) {
        setSplitError(`Percentages must sum to 100%. Current sum: ${total.toFixed(2)}%`)
        return false
      }
    }

    if (splitType === 'SHARE') {
      const hasAllValues = selectedParticipants.every((p) => (splits[p.userId] || 0) > 0)
      if (!hasAllValues) {
        setSplitError('All participants must have at least 1 share')
        return false
      }
    }

    return true
  }

  const onSubmit = async (values) => {
    if (!validateSplits()) {
      return
    }

    try {
      // FIX: Build participants with correct backend DTO shape:
      //   { userId: Long, amountOwed?, percentage?, shares? }
      //   Backend ExpenseParticipantRequest does NOT have a 'splitType' field.
      //   'amount' field does not exist — backend uses 'amountOwed'.
      const participants = selectedParticipants.map((p) => {
        // FIX: userId must be a Number (Long) — p.userId is the actual User PK
        const userId = Number(p.userId)

        if (splitType === 'EQUAL') {
          return { userId }
        } else if (splitType === 'UNEQUAL') {
          return {
            userId,
            amountOwed: splits[p.userId] || 0,   // FIX: was 'amount', backend expects 'amountOwed'
          }
        } else if (splitType === 'PERCENTAGE') {
          return {
            userId,
            percentage: splits[p.userId] || 0,
          }
        } else if (splitType === 'SHARE') {
          return {
            userId,
            shares: splits[p.userId] || 0,
          }
        }
      })

      const payload = {
        groupId: Number(groupId),
        title: values.title,
        description: values.description,
        amount: values.amount,
        // FIX: correct field name + coerce HTML select string → Number (Long)
        paidByUserId: Number(values.paidByUserId),
        splitType,
        participants,
      }

      // Debug: verify the payload matches backend DTO exactly before sending
      console.log('Expense Payload', payload)

      await createExpense.mutateAsync(payload)
      showToast({
        type: 'success',
        title: 'Expense created',
        message: 'Your expense has been created successfully.',
      })
      resetDialogState()
      onOpenChange(false)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to create expense',
        message: error?.response?.data?.message ?? 'Unable to create expense',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="space-y-4 max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>
          <DialogDescription>
            Add a new expense and split it with group members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-800" htmlFor="title">
                Title
              </label>
              <Input
                id="title"
                placeholder="e.g., Dinner"
                autoComplete="off"
                {...register('title')}
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800" htmlFor="description">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="e.g., Friday dinner at the restaurant"
                autoComplete="off"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800" htmlFor="amount">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  autoComplete="off"
                  {...register('amount', { valueAsNumber: true })}
                />
                {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-800" htmlFor="paidByUserId">
                  Paid By
                </label>
                {/*
                  FIX 1: Registered as 'paidByUserId' — matches backend DTO field name.
                  FIX 2: value={String(member.userId)} uses the User PK (Long), NOT
                         member.id which is the GroupMember join-table row ID.
                  Display shows member.name so user sees "Rahul", "Amit" etc.
                  On submit, Number(values.paidByUserId) coerces the string back to Long.
                */}
                <select
                  id="paidByUserId"
                  className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  {...register('paidByUserId')}
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member.userId} value={String(member.userId)}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {errors.paidByUserId && <p className="mt-2 text-sm text-red-600">{errors.paidByUserId.message}</p>}
              </div>
            </div>
          </div>

          {/* Split Type */}
          <SplitTypeSelector value={splitType} onChange={setSplitType} />

          {/* Participants Selection */}
          <div>
            <label className="text-sm font-medium text-slate-800 mb-3 block">
              Participants
            </label>
            <div className="space-y-2">
              {members.map((member) => (
                // FIX: keyed and checked by member.userId (User PK), NOT member.id
                <label key={member.userId} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.some((p) => p.userId === member.userId)}
                    onChange={() => toggleParticipant(member)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-950"
                  />
                  <span className="text-sm text-slate-700">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Participants Splits */}
          {selectedParticipants.length > 0 && (
            <ExpenseParticipantsTable
              splitType={splitType}
              participants={selectedParticipants}
              totalAmount={amount}
              splits={splits}
              onSplitChange={handleSplitChange}
              errors={{ splits: splitError }}
            />
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createExpense.isPending}>
              {isSubmitting || createExpense.isPending ? 'Creating...' : 'Create Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
