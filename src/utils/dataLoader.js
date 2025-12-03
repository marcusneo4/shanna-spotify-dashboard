/**
 * Load and combine all Spotify streaming history JSON files
 * Note: Files should be placed in the public/data/ folder
 */

const AUDIO_FILES = [
  'Streaming_History_Audio_2016-2020_0.json',
  'Streaming_History_Audio_2020-2021_1.json',
  'Streaming_History_Audio_2021-2022_2.json',
  'Streaming_History_Audio_2022-2023_3.json',
  'Streaming_History_Audio_2023_4.json',
  'Streaming_History_Audio_2023-2024_5.json',
  'Streaming_History_Audio_2024-2025_6.json',
  'Streaming_History_Audio_2025_7.json'
]

/**
 * Load a single JSON file from public folder
 */
async function loadJSONFile(fileName) {
  try {
    const response = await fetch(`/data/${fileName}`)
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}: ${response.statusText}`)
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error)
    return []
  }
}

/**
 * Load all audio streaming history files and combine them
 * Priority: 1. IndexedDB (uploaded files), 2. public/data folder
 */
export async function loadAllStreamingData() {
  console.log('Loading Spotify streaming history data...')
  
  // First, try to load from IndexedDB (uploaded files)
  try {
    const { loadSpotifyData } = await import('./indexedDB')
    const uploadedData = await loadSpotifyData()
    if (uploadedData && uploadedData.length > 0) {
      console.log(`Using uploaded data: ${uploadedData.length} records`)
      return uploadedData
    }
  } catch (error) {
    console.warn('Error loading from IndexedDB:', error)
    // Continue to fallback
  }
  
  // Fall back to loading from public/data folder
  console.log('No uploaded data found, loading from public/data folder...')
  const allData = []
  
  for (const file of AUDIO_FILES) {
    console.log(`Loading ${file}...`)
    const data = await loadJSONFile(file)
    allData.push(...data)
    console.log(`Loaded ${data.length} records from ${file}`)
  }
  
  console.log(`Total records loaded: ${allData.length}`)
  return allData
}

/**
 * Filter out podcasts/episodes and focus on music tracks
 */
export function filterMusicOnly(data) {
  return data.filter(item => 
    item.master_metadata_track_name !== null &&
    item.master_metadata_album_artist_name !== null
  )
}
