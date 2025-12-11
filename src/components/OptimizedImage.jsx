/**
 * OptimizedImage Component
 *
 * Provides automatic WebP format with fallback support for optimal performance.
 * Includes explicit width/height for CLS prevention.
 *
 * @param {string} srcWebp - Path to WebP image
 * @param {string} srcFallback - Path to fallback image (JPEG/PNG)
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Explicit width in pixels
 * @param {number} height - Explicit height in pixels
 * @param {string} className - Tailwind/CSS classes
 * @param {string} loading - Loading strategy ("lazy" | "eager"), default "lazy"
 * @param {object} style - Inline styles if needed
 */
export default function OptimizedImage({
  srcWebp,
  srcFallback,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  style = {}
}) {
  const baseUrl = import.meta.env.BASE_URL || '/'

  // Ensure paths are properly formatted
  const formatPath = (path) => {
    if (!path) return ''
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${baseUrl}${cleanPath}`
  }

  return (
    <picture>
      {srcWebp && (
        <source
          type="image/webp"
          srcSet={formatPath(srcWebp)}
        />
      )}
      <img
        src={formatPath(srcFallback)}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={className}
        style={style}
        decoding="async"
      />
    </picture>
  )
}
