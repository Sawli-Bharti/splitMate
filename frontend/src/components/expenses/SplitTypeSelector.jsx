const splitTypeLabels = {
  EQUAL: 'Equal Split',
  UNEQUAL: 'Unequal Split',
  PERCENTAGE: 'Percentage Split',
  SHARE: 'Share Split',
}

export default function SplitTypeSelector({ value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-800 mb-3 block">
        Split Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(splitTypeLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative flex items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
              value === key
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-950'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
