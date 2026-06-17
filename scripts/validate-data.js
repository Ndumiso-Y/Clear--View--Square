import fs from 'fs'
import path from 'path'

const STORES_PATH = path.resolve('public/data/stores.json')
const PROMOTIONS_PATH = path.resolve('public/data/promotions.json')

function validateDate(dateStr) {
  if (!dateStr) return false
  const date = new Date(dateStr)
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
}

function runValidation() {
  console.log('--- DATA VALIDATION CHECK ---')
  let hasErrors = false

  // 1. Load data
  if (!fs.existsSync(STORES_PATH)) {
    console.error(`Error: Stores data file not found at ${STORES_PATH}`)
    process.exit(1)
  }
  if (!fs.existsSync(PROMOTIONS_PATH)) {
    console.error(`Error: Promotions data file not found at ${PROMOTIONS_PATH}`)
    process.exit(1)
  }

  const stores = JSON.parse(fs.readFileSync(STORES_PATH, 'utf8'))
  const promotions = JSON.parse(fs.readFileSync(PROMOTIONS_PATH, 'utf8'))

  console.log(`Loaded ${stores.length} stores.`)
  console.log(`Loaded ${promotions.length} promotions.`)

  // 2. Validate stores
  const storeIds = new Set()
  const storeSlugs = new Set()
  const validStoreStatuses = new Set(['published', 'draft', 'hidden', 'opening_soon'])

  stores.forEach((store, index) => {
    const storeLabel = store.name || `Store at index ${index}`

    // Check ID
    if (!store.id) {
      console.error(`[STORE ERROR] ${storeLabel} is missing required 'id' field.`)
      hasErrors = true
    } else {
      if (storeIds.has(store.id)) {
        console.error(`[STORE ERROR] Duplicate store ID found: '${store.id}'`)
        hasErrors = true
      }
      storeIds.add(store.id)
    }

    // Check Slug
    if (!store.slug) {
      console.error(`[STORE ERROR] ${storeLabel} is missing required 'slug' field.`)
      hasErrors = true
    } else {
      if (storeSlugs.has(store.slug)) {
        console.error(`[STORE ERROR] Duplicate store slug found: '${store.slug}'`)
        hasErrors = true
      }
      if (store.slug !== store.slug.toLowerCase() || !/^[a-z0-9-]+$/.test(store.slug)) {
        console.error(`[STORE ERROR] Slug '${store.slug}' is not lowercase and URL-safe.`)
        hasErrors = true
      }
      storeSlugs.add(store.slug)
    }

    // Check required fields
    const requiredFields = ['name', 'category', 'status', 'isVisible', 'isAnchor', 'isFeatured', 'sortOrder']
    requiredFields.forEach(field => {
      if (store[field] === undefined || store[field] === null) {
        console.error(`[STORE ERROR] '${store.id || storeLabel}' is missing required field: '${field}'`)
        hasErrors = true
      }
    })

    // Check invalid store status
    if (store.status && !validStoreStatuses.has(store.status)) {
      console.error(`[STORE ERROR] Store '${store.id}' has invalid status: '${store.status}'`)
      hasErrors = true
    }
  })

  // 3. Validate promotions
  const promoIds = new Set()
  const promoSlugs = new Set()
  const validPromoStatuses = new Set(['published', 'draft', 'hidden'])

  promotions.forEach((promo, index) => {
    const promoLabel = promo.title || `Promotion at index ${index}`

    // Check ID
    if (!promo.id) {
      console.error(`[PROMO ERROR] ${promoLabel} is missing required 'id' field.`)
      hasErrors = true
    } else {
      if (promoIds.has(promo.id)) {
        console.error(`[PROMO ERROR] Duplicate promotion ID found: '${promo.id}'`)
        hasErrors = true
      }
      promoIds.add(promo.id)
    }

    // Check Slug
    if (!promo.slug) {
      console.error(`[PROMO ERROR] ${promoLabel} is missing required 'slug' field.`)
      hasErrors = true
    } else {
      if (promoSlugs.has(promo.slug)) {
        console.error(`[PROMO ERROR] Duplicate promotion slug found: '${promo.slug}'`)
        hasErrors = true
      }
      if (promo.slug !== promo.slug.toLowerCase() || !/^[a-z0-9-]+$/.test(promo.slug)) {
        console.error(`[PROMO ERROR] Slug '${promo.slug}' is not lowercase and URL-safe.`)
        hasErrors = true
      }
      promoSlugs.add(promo.slug)
    }

    // Check invalid promotion status
    if (promo.status && !validPromoStatuses.has(promo.status)) {
      console.error(`[PROMO ERROR] Promotion '${promo.id}' has invalid status: '${promo.status}'`)
      hasErrors = true
    }

    // Check linked storeId exists
    if (promo.storeId && !storeIds.has(promo.storeId)) {
      console.error(`[PROMO ERROR] Promotion '${promo.id}' is linked to non-existent storeId: '${promo.storeId}'`)
      hasErrors = true
    }

    // Check invalid dates
    if (!validateDate(promo.startDate)) {
      console.error(`[PROMO ERROR] Promotion '${promo.id}' has invalid startDate: '${promo.startDate}' (expected YYYY-MM-DD)`)
      hasErrors = true
    }
    if (!validateDate(promo.endDate)) {
      console.error(`[PROMO ERROR] Promotion '${promo.id}' has invalid endDate: '${promo.endDate}' (expected YYYY-MM-DD)`)
      hasErrors = true
    }

    if (promo.startDate && promo.endDate && new Date(promo.startDate) > new Date(promo.endDate)) {
      console.error(`[PROMO ERROR] Promotion '${promo.id}' has startDate later than endDate.`)
      hasErrors = true
    }
  })

  if (hasErrors) {
    console.error('\n❌ Data validation failed. Please check errors above.')
    process.exit(1)
  } else {
    console.log('\n✅ Data validation passed successfully!')
    process.exit(0)
  }
}

runValidation()
