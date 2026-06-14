import { Input } from '../../components/ui/input'

export default function ExpenseParticipantsTable({
  splitType,
  participants = [],
  totalAmount,
  splits = {},
  onSplitChange,
  errors = {},
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // FIX: splits map is now keyed by participant.userId (User PK), not participant.id
  const getParticipantSplit = (participantUserId) => {
    return splits[participantUserId] || (splitType === 'EQUAL' ? '' : 0)
  }

  const calculateEqualShare = () => {
    if (splitType === 'EQUAL' && participants.length > 0) {
      return totalAmount / participants.length
    }
    return 0
  }

  const renderInput = (participant) => {
    if (splitType === 'EQUAL') {
      return (
        <div className="text-slate-700 text-sm">
          {formatCurrency(calculateEqualShare())}
        </div>
      )
    }

    // FIX: use participant.userId (User PK) not participant.id (GroupMember row ID)
    const value = getParticipantSplit(participant.userId)
    const step = splitType === 'PERCENTAGE' ? '0.01' : '0.01'
    const suffix = splitType === 'PERCENTAGE' ? '%' : splitType === 'SHARE' ? ' shares' : ''

    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          step={step}
          min="0"
          value={value}
          // FIX: call onSplitChange with participant.userId so the splits map is keyed correctly
          onChange={(e) => onSplitChange(participant.userId, parseFloat(e.target.value) || 0)}
          placeholder={splitType === 'PERCENTAGE' ? '0%' : '0'}
          className="w-full"
        />
        {suffix && <span className="text-sm text-slate-500 min-w-fit">{suffix}</span>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">Participant</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">
                {splitType === 'EQUAL'
                  ? 'Amount'
                  : splitType === 'PERCENTAGE'
                    ? 'Percentage'
                    : splitType === 'SHARE'
                      ? 'Shares'
                      : 'Amount Owed'}
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              // FIX: key by participant.userId (User PK), not participant.id
              <tr key={participant.userId} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-3 text-slate-950">{participant.name}</td>
                <td className="py-3 px-3 text-right">{renderInput(participant)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.splits && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {errors.splits}
        </div>
      )}
    </div>
  )
}
