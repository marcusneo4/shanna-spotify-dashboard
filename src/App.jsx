import { useState } from 'react'
import Dashboard from './components/Dashboard'
import PasswordProtection from './components/PasswordProtection'

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('unlocked') === 'true'
  })

  const handlePasswordCorrect = () => {
    setIsUnlocked(true)
  }

  if (!isUnlocked) {
    return <PasswordProtection onPasswordCorrect={handlePasswordCorrect} />
  }

  return (
    <div className="app">
      <Dashboard />
    </div>
  )
}

export default App
