import { useState, useEffect } from 'react'
import ModuleCard from '../components/ModuleCard'
import SearchPanel from '../components/SearchPanel'
import ImportModal from '../components/ImportModal'
import RequestDetail from '../components/RequestDetail'

const API_BASE = '/api'

export default function Analyzer() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [searchMode, setSearchMode] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [detailWidth, setDetailWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    fetchModules()
  }, [])

  // Handle resize drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      setDetailWidth(Math.min(Math.max(newWidth, 300), 800))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const fetchModules = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/modules`)
      const data = await response.json()
      if (data.success) {
        setModules(data.modules)
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteModule = async (moduleId) => {
    try {
      const response = await fetch(`${API_BASE}/modules/deleteById?id=${moduleId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setModules(modules.filter(m => m.id !== moduleId))
        if (searchResults) {
          setSearchResults(searchResults.filter(r => r.module_id !== moduleId))
        }
      }
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const handleSearch = async (query, mode) => {
    if (!query) {
      setSearchMode(null)
      setSearchResults(null)
      return
    }

    setLoading(true)
    setSearchMode(mode)
    try {
      const response = await fetch(`${API_BASE}/modules/search?q=${encodeURIComponent(query)}&mode=${mode}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.requests)
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (importData) => {
    try {
      const response = await fetch(`${API_BASE}/modules/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchModules()
        setShowImportModal(false)
      }
    } catch (error) {
      console.error('Error importing:', error)
    }
  }

  const handleExport = async (moduleId) => {
    try {
      const response = await fetch(`${API_BASE}/modules/exportData?id=${moduleId}`)
      const data = await response.json()
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data.data.module.name}_export.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting:', error)
    }
  }

  const handleSelectRequest = (request) => {
    setSelectedRequest(request)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Search Panel */}
      <SearchPanel onSearch={handleSearch} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Module List or Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchMode ? (
            /* Search Results */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">
                  Search Results ({searchResults?.length || 0})
                </h2>
                <button
                  onClick={() => {
                    setSearchMode(null)
                    setSearchResults(null)
                  }}
                  className="text-slate-400 hover:text-slate-200 text-sm"
                >
                  ← Back to Modules
                </button>
              </div>

              {searchResults && searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => handleSelectRequest(request)}
                      className={`bg-slate-800 rounded-lg border border-slate-700 p-3 cursor-pointer hover:bg-slate-700/50 ${selectedRequest?.id === request.id ? 'border-blue-500' : ''}`}
                    >
                      <SearchResultRow request={request} searchMode={searchMode} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  No results found
                </div>
              )}
            </div>
          ) : (
            /* Module List */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">
                  Modules ({modules.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    📥 Import
                  </button>
                  <button
                    onClick={fetchModules}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : modules.length > 0 ? (
                <div className="space-y-3">
                  {modules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      onDelete={handleDeleteModule}
                      onExport={handleExport}
                      onSelectRequest={handleSelectRequest}
                      selectedRequest={selectedRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <div className="text-4xl mb-2">📂</div>
                  <div>No modules yet</div>
                  <div className="text-sm text-slate-600 mt-1">
                    Save requests from the Crawler to create modules
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className={`w-1 bg-slate-700 hover:bg-blue-500 cursor-col-resize transition-colors ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Right Panel - Request Detail */}
        <div style={{ width: detailWidth, minWidth: 300, maxWidth: 800 }}>
          <RequestDetail
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  )
}

function SearchResultRow({ request, searchMode }) {
  const methodColors = {
    GET: 'bg-green-600',
    POST: 'bg-blue-600',
    PUT: 'bg-amber-600',
    DELETE: 'bg-red-600',
    PATCH: 'bg-purple-600'
  }

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname + urlObj.search
    } catch {
      return url
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`${methodColors[request.method] || 'bg-gray-600'} text-white text-xs font-bold px-2 py-1 rounded`}>
        {request.method}
      </span>
      <span className="text-slate-400 text-sm">{request.status || '---'}</span>
      <span className="font-mono text-sm text-slate-300 truncate flex-1">
        {formatUrl(request.url)}
      </span>
      {request.module && (
        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
          {request.module.name}
        </span>
      )}
    </div>
  )
}
