import { useState } from 'react'

const getMethodClass = (method) => {
  const classes = {
    GET: 'bg-green-600',
    POST: 'bg-blue-600',
    PUT: 'bg-amber-600',
    DELETE: 'bg-red-600',
    PATCH: 'bg-purple-600'
  }
  return classes[method] || 'bg-gray-600'
}

const getStatusClass = (status) => {
  if (!status) return 'text-slate-500'
  if (status >= 200 && status < 300) return 'text-green-500'
  if (status >= 300 && status < 400) return 'text-blue-500'
  if (status >= 400 && status < 500) return 'text-amber-500'
  if (status >= 500) return 'text-red-500'
  return 'text-slate-500'
}

export default function RequestDetail({ request, onClose }) {
  const [activeTab, setActiveTab] = useState('response')

  // Data is already available in the request object from getById
  // No need to fetch additional details
  const currentRequest = request

  if (!currentRequest) {
    return (
      <div className="h-full bg-slate-800 border-l border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Request Details</h3>
        </div>
        <div className="flex items-center justify-center h-64 text-slate-500">
          Select a request to view details
        </div>
      </div>
    )
  }

  const formatJson = (str) => {
    if (!str) return ''
    try {
      const json = typeof str === 'string' ? JSON.parse(str) : str
      return JSON.stringify(json, null, 2)
    } catch {
      return str
    }
  }

  // Handle both camelCase and snake_case field names
  const headers = currentRequest.headers || {}
  const responseHeaders = currentRequest.responseHeaders || currentRequest.response_headers || {}
  const responseBody = currentRequest.responseBody || currentRequest.response_body
  const postData = currentRequest.postData || currentRequest.post_data

  return (
    <div className="h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-200">Request Details</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${getMethodClass(currentRequest.method)} text-white text-xs font-bold px-2 py-1 rounded`}>
            {currentRequest.method}
          </span>
          <span className={`font-mono text-lg ${getStatusClass(currentRequest.status)}`}>
            {currentRequest.status || '...'}
          </span>
        </div>
        <div className="mt-2 font-mono text-xs text-slate-400 break-all">
          {currentRequest.url}
        </div>
      </div>

      <div className="border-b border-slate-700">
        <div className="flex">
          {['response', 'request', 'headers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-2 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'response' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Response Body</h4>
              {responseBody ? (
                <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto max-h-96 font-mono whitespace-pre-wrap">
                  {formatJson(responseBody)}
                </pre>
              ) : (
                <div className="text-slate-500 text-sm">No response body</div>
              )}
            </div>
            {currentRequest.error && (
              <div className="mb-4 p-3 bg-red-900/30 rounded border border-red-700">
                <h4 className="text-sm font-medium text-red-400 mb-1">Error</h4>
                <div className="text-xs text-red-300">{currentRequest.error}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'request' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-400 mb-2">URL</h4>
              <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono break-all">
                {currentRequest.url}
              </div>
            </div>
            {postData && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Request Body</h4>
                <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto max-h-64 font-mono whitespace-pre-wrap">
                  {formatJson(postData)}
                </pre>
              </div>
            )}
            {!postData && (
              <div className="text-slate-500 text-sm">No request body</div>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Request Headers</h4>
              <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono">
                {Object.keys(headers).length > 0 ? (
                  Object.entries(headers).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="text-blue-400">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : value}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">No request headers</div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Response Headers</h4>
              <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono">
                {Object.keys(responseHeaders).length > 0 ? (
                  Object.entries(responseHeaders).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="text-blue-400">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : value}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">No response headers</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
