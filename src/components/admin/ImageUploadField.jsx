import { useState } from 'react'
import {
  uploadStoreLogo,
  uploadStoreImage,
  uploadPromotionImage,
  validateImageFile,
} from '../../services/storageService.js'

export default function ImageUploadField({
  label,
  value,
  onChange,
  uploadType,
  entitySlug,
  disabled = false,
  helperText = 'Accepted formats: JPG, PNG, WebP, SVG. Maximum size: 2 MB.',
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const isSlugMissing = !entitySlug?.trim()

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      // 1. Client-side validation
      validateImageFile(file)

      // 2. Perform upload depending on type
      let result
      if (uploadType === 'store-logo') {
        result = await uploadStoreLogo(file, entitySlug)
      } else if (uploadType === 'store-image') {
        result = await uploadStoreImage(file, entitySlug)
      } else if (uploadType === 'promotion-image') {
        result = await uploadPromotionImage(file, entitySlug)
      } else {
        throw new Error(`Invalid upload type: ${uploadType}`)
      }

      // 3. Update parent state with public URL
      onChange(result.publicUrl)
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      // Reset the file input value so same file can be uploaded again
      e.target.value = ''
    }
  }

  function handleClear() {
    setError(null)
    onChange('')
  }

  return (
    <div className="space-y-2">
      {label && (
        <span className="block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      {/* Image Preview Area */}
      {value && (
        <div className="relative inline-block border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-w-[200px]">
          <img
            src={value}
            alt={`${label || 'Asset'} preview`}
            className="object-contain max-h-32 w-auto"
            onError={(e) => {
              // Handle cases like PDF or broken paths gracefully
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Upload Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* File Input button trigger */}
        <div className="relative">
          <input
            id={`file-input-${uploadType}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            disabled={disabled || uploading || isSlugMissing}
            className="sr-only"
          />
          <label
            htmlFor={`file-input-${uploadType}`}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-gray-900 cursor-pointer select-none transition-colors ${
              (disabled || uploading || isSlugMissing) ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
            }`}
          >
            {uploading ? 'Uploading…' : 'Upload File'}
          </label>
        </div>

        {/* Text Input fallback for direct path edits */}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            setError(null)
            onChange(e.target.value)
          }}
          disabled={disabled || uploading}
          placeholder="Or paste asset URL/path here"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled || uploading}
            className="px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Helper & Error Messages */}
      {isSlugMissing && (
        <p className="text-xs text-amber-600 font-medium">
          Enter a slug before uploading images.
        </p>
      )}

      {helperText && !error && !isSlugMissing && (
        <p className="text-xs text-gray-400">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
