import { supabase, hasSupabaseConfig } from '../lib/supabase.js'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

export function validateImageFile(file) {
  if (!file) throw new Error('No file selected.')

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Accepted formats: JPG, PNG, WebP, SVG.')
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File is too large. Maximum allowed size is 2 MB.')
  }

  return true
}

export function getPublicAssetUrl(bucket, path) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Upload helper to standardise upload operations
async function uploadFile(bucket, path, file) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  
  validateImageFile(file)

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
    })

  if (error) throw error
  
  const publicUrl = getPublicAssetUrl(bucket, path)
  return { path: data.path, publicUrl }
}

function getFileExtension(file) {
  // Extract extension from filename or fall back to mime sub-type
  const nameParts = file.name.split('.')
  if (nameParts.length > 1) {
    return nameParts.pop().toLowerCase()
  }
  return file.type.split('/')[1] || 'png'
}

export async function uploadStoreLogo(file, storeSlug) {
  if (!storeSlug?.trim()) throw new Error('Store slug is required before uploading a logo.')
  const timestamp = Date.now()
  const ext = getFileExtension(file)
  const path = `stores/${storeSlug}/logo-${timestamp}.${ext}`
  return uploadFile('store-assets', path, file)
}

export async function uploadStoreImage(file, storeSlug) {
  if (!storeSlug?.trim()) throw new Error('Store slug is required before uploading a main image.')
  const timestamp = Date.now()
  const ext = getFileExtension(file)
  const path = `stores/${storeSlug}/image-${timestamp}.${ext}`
  return uploadFile('store-assets', path, file)
}

export async function uploadPromotionImage(file, promotionSlug) {
  if (!promotionSlug?.trim()) throw new Error('Promotion slug is required before uploading an image.')
  const timestamp = Date.now()
  const ext = getFileExtension(file)
  const path = `promotions/${promotionSlug}/image-${timestamp}.${ext}`
  return uploadFile('promotion-assets', path, file)
}
