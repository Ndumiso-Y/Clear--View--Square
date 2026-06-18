const STATUS_STYLES = {
  published: 'bg-green-100 text-green-700',
  draft:     'bg-yellow-100 text-yellow-700',
  hidden:    'bg-gray-100 text-gray-500',
}

const STATUS_LABELS = {
  published: 'Published',
  draft:     'Draft',
  hidden:    'Hidden',
}

export default function PromotionStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'
  const label = STATUS_LABELS[status] ?? status
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}
