/**
 * IndexedDB utility for storing large Spotify data
 * IndexedDB can handle much larger datasets than localStorage (hundreds of MB)
 */

const DB_NAME = 'SpotifyDashboardDB'
const DB_VERSION = 1
const STORE_NAME = 'spotifyData'

/**
 * Open the IndexedDB database
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

/**
 * Store Spotify data in IndexedDB
 */
export async function storeSpotifyData(data) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.put(data, 'spotifyData')
      request.onsuccess = () => {
        // Also store timestamp in a separate entry for quick checking
        const timestampStore = store.put(Date.now(), 'spotifyDataTimestamp')
        timestampStore.onsuccess = () => resolve()
        timestampStore.onerror = () => reject(timestampStore.error)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error storing data in IndexedDB:', error)
    throw error
  }
}

/**
 * Load Spotify data from IndexedDB
 */
export async function loadSpotifyData() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.get('spotifyData')
      request.onsuccess = () => {
        const data = request.result
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`Loaded ${data.length} records from IndexedDB`)
          resolve(data)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error loading data from IndexedDB:', error)
    return null
  }
}

/**
 * Check if data exists in IndexedDB
 */
export async function hasStoredData() {
  try {
    const data = await loadSpotifyData()
    return data !== null && data.length > 0
  } catch (error) {
    return false
  }
}

/**
 * Clear all stored Spotify data from IndexedDB
 */
export async function clearSpotifyData() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const deleteRequest = store.delete('spotifyData')
      const deleteTimestampRequest = store.delete('spotifyDataTimestamp')
      
      let completed = 0
      const checkComplete = () => {
        completed++
        if (completed === 2) {
          resolve()
        }
      }

      deleteRequest.onsuccess = checkComplete
      deleteRequest.onerror = () => reject(deleteRequest.error)
      deleteTimestampRequest.onsuccess = checkComplete
      deleteTimestampRequest.onerror = () => reject(deleteTimestampRequest.error)
    })
  } catch (error) {
    console.error('Error clearing data from IndexedDB:', error)
    throw error
  }
}

