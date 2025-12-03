import { useState } from 'react'
import '../styles/components.css'

function PasswordProtection({ onPasswordCorrect }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Check if already unlocked in this session
    return sessionStorage.getItem('unlocked') === 'true'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'MnS') {
      setIsUnlocked(true)
      sessionStorage.setItem('unlocked', 'true')
      setError('')
      onPasswordCorrect()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  // If already unlocked, don't show the form
  if (isUnlocked) {
    return null
  }

  return (
    <div className="password-container">
      {/* Decorative Llamas */}
      <div className="llama-left">🦙</div>
      <div className="llama-right">🦙</div>
      
      <div className="password-box">
        <div className="password-header">
          <img src="/sakura-logo.svg" alt="Sakura flower" className="password-logo" />
          <h1>Shannify Wrapped</h1>
          <p>Enter password to access</p>
        </div>
        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Enter password"
            className="password-input"
            autoFocus
          />
          {error && <div className="password-error">{error}</div>}
          <button type="submit" className="password-button">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordProtection

