import React from 'react'

export default function FormField({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  required = false,
  rows,
  options,
  value,
  onChange,
  className = '',
  helpText
}) {
  const baseInputClass = "w-full border border-brand-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-brand-dark mb-2">
        {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows || 4}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`${baseInputClass} resize-none`}
          aria-describedby={helpText ? `${id}-help` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={baseInputClass}
          aria-describedby={helpText ? `${id}-help` : undefined}
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={baseInputClass}
          aria-describedby={helpText ? `${id}-help` : undefined}
        />
      )}

      {helpText && (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-brand-mid opacity-85">
          {helpText}
        </p>
      )}
    </div>
  )
}
