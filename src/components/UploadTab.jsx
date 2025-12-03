import { useState, useRef, useEffect } from 'react'
import { storeSpotifyData, hasStoredData, clearSpotifyData } from '../utils/indexedDB'
import '../styles/components.css'

function UploadTab({ onDataUploaded }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files)
    const jsonFiles = selectedFiles.filter(file => 
      file.name.endsWith('.json') && 
      file.name.includes('Streaming_History_Audio')
    )
    
    if (jsonFiles.length === 0) {
      setError('Please select Spotify streaming history JSON files (files should contain "Streaming_History_Audio" in the name)')
      return
    }

    setFiles(jsonFiles)
    setError(null)
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one JSON file')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const allData = []
      
      // Process files one by one with progress feedback
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`)
        const text = await file.text()
        const data = JSON.parse(text)
        
        if (Array.isArray(data)) {
          allData.push(...data)
          console.log(`Added ${data.length} records from ${file.name} (Total: ${allData.length})`)
        } else {
          console.warn(`File ${file.name} does not contain an array`)
        }
      }

      if (allData.length === 0) {
        throw new Error('No valid data found in the uploaded files')
      }

      console.log(`Storing ${allData.length} total records in IndexedDB...`)
      // Store in IndexedDB (can handle large datasets - much larger than localStorage)
      await storeSpotifyData(allData)
      console.log('Data successfully stored in IndexedDB!')

      setSuccess(true)
      setFiles([])
      setHasData(true) // Update state to show data is stored
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Notify parent component (this will switch to dashboard tab)
      if (onDataUploaded) {
        onDataUploaded(allData)
      }

    } catch (err) {
      console.error('Error processing files:', err)
      setError(`Error processing files: ${err.message}. Please make sure the files are valid JSON files from Spotify.`)
    } finally {
      setUploading(false)
    }
  }

  const [hasData, setHasData] = useState(false)

  // Check if data exists on mount
  useEffect(() => {
    checkForStoredData()
  }, [])

  const checkForStoredData = async () => {
    const exists = await hasStoredData()
    setHasData(exists)
  }

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all uploaded data? This will remove your data from this browser.')) {
      try {
        await clearSpotifyData()
        setFiles([])
        setSuccess(false)
        setError(null)
        setHasData(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        alert('Data cleared! Please refresh the page.')
      } catch (error) {
        setError(`Error clearing data: ${error.message}`)
      }
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <h2>📤 Upload Your Spotify Data</h2>
          <p>Upload your Spotify Extended Streaming History JSON files to view your personalized dashboard</p>
        </div>

        {hasData && (
          <div className="upload-info" style={{ 
            background: 'linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '2px solid #FF69B4'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <strong>Data already loaded!</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                  You have data stored in this browser. Switch to the Dashboard tab to view it, or upload new files to replace it.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="upload-section">
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              multiple
              accept=".json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                <strong>Click to select files</strong>
                <span>or drag and drop JSON files here</span>
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="files-list">
              <h3>Selected Files ({files.length}):</h3>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="upload-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="upload-success">
              <span>✅</span> 
              <div>
                <strong>Success!</strong> Your data has been uploaded and processed. 
                View your dashboard in the Dashboard tab!
              </div>
            </div>
          )}

          <div className="upload-actions">
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              style={{ 
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              {uploading ? '⏳ Processing...' : '🚀 Upload & Process Files'}
            </button>

            {hasData && (
              <button
                className="btn"
                onClick={handleClearData}
                style={{ 
                  padding: '15px 30px',
                  fontSize: '1rem',
                  marginLeft: '10px'
                }}
              >
                🗑️ Clear Stored Data
              </button>
            )}
          </div>
        </div>

        <div className="upload-instructions">
          <h3>📋 How to Get Your Spotify Data:</h3>
          <ol>
            <li>Go to <a href="https://www.spotify.com/account/privacy/" target="_blank" rel="noopener noreferrer">Spotify Privacy Settings</a></li>
            <li>Scroll down and click <strong>"Request your data"</strong></li>
            <li>Select <strong>"Extended streaming history"</strong> and submit</li>
            <li>Wait for Spotify to email you (may take a few days)</li>
            <li>Download and extract the ZIP file</li>
            <li>Find the <code>Streaming_History_Audio</code> folder</li>
            <li>Select all the JSON files (they'll be named like <code>Streaming_History_Audio_2016-2020_0.json</code>)</li>
            <li>Upload them here!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default UploadTab

