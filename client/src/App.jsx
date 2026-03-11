import { useState } from 'react'
import Crawler from './pages/Crawler'
import Analyzer from './pages/Analyzer'
import NavBar from './components/NavBar'

function App() {
  const [currentPage, setCurrentPage] = useState('crawler')

  return (
    <div className="min-h-screen bg-slate-900">
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'crawler' && <Crawler />}
      {currentPage === 'analyzer' && <Analyzer />}
    </div>
  )
}

export default App
