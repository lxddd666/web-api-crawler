import { useState } from 'react'

export default function SearchPanel({ onSearch }) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('request-response')

  const handleSearch = () => {
    onSearch(query, mode)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-slate-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search in modules..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="url">URL</option>
            <option value="header">Header</option>
            <option value="request-response">Request + Response</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Search
        </button>

        {query && (
          <button
            onClick={() => {
              setQuery('')
              onSearch('', '')
            }}
            className="text-slate-400 hover:text-slate-200 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mode Description */}
      <div className="mt-2 text-xs text-slate-500">
        {mode === 'url' && 'Search in request URLs'}
        {mode === 'header' && 'Search in request and response headers'}
        {mode === 'request-response' && 'Search in request body and response body (results shown in two columns)'}
      </div>
    </div>
  )
}
