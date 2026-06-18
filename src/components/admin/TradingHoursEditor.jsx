import { DAY_KEYS, DAY_LABELS } from '../../utils/adminStoreFormUtils.js'

export default function TradingHoursEditor({ value, onChange }) {
  function handleNotesChange(dayKey, notes) {
    onChange({ ...value, [dayKey]: { ...value[dayKey], notes } })
  }

  function handleClosedToggle(dayKey, isClosed) {
    const current = value[dayKey] || {}
    onChange({
      ...value,
      [dayKey]: {
        ...current,
        isClosed,
        // Auto-fill "Closed" when toggling closed; clear it when un-toggling.
        notes: isClosed ? 'Closed' : (current.notes === 'Closed' ? '' : current.notes),
      },
    })
  }

  return (
    <div className="space-y-2">
      {DAY_KEYS.map(key => {
        const day = value[key] || { notes: '', isClosed: false }
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-32 text-sm text-gray-600 shrink-0">{DAY_LABELS[key]}</span>
            <input
              type="text"
              value={day.notes ?? ''}
              onChange={e => handleNotesChange(key, e.target.value)}
              disabled={day.isClosed}
              placeholder="e.g. 09:00 – 18:00"
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <label className="flex items-center gap-1.5 text-sm text-gray-600 shrink-0 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={day.isClosed ?? false}
                onChange={e => handleClosedToggle(key, e.target.checked)}
                className="rounded border-gray-300"
              />
              Closed
            </label>
          </div>
        )
      })}
    </div>
  )
}
