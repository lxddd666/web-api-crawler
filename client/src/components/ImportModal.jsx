import { useState, useRef } from 'react'

export default function ImportModal({ onClose, onImport }) {
  const [jsonContent, setJsonContent] = useState('')
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const text = await file.text()
      setJsonContent(text)
      validateAndPreview(text)
    } catch (err) {
      setError('Failed to read file')
    }
  }

  const validateAndPreview = (text) => {
    try {
      const data = JSON.parse(text)
      setError(null)

      if (!data.module || !data.module.name) {
        setError('Invalid format: missing module name')
        return
      }

      if (!data.requests || !Array.isArray(data.requests)) {
        setError('Invalid format: missing requests array')
        return
      }

      setPreview({
        moduleName: data.module.name,
        moduleDescription: data.module.description || '',
        requestCount: data.requests.length,
        sampleRequest: data.requests[0] || null
      })
    } catch (err) {
      setError('Invalid JSON format')
      setPreview(null)
    }
  }

  const handleTextChange = (e) => {
    const text = e.target.value
    setJsonContent(text)
    if (text.trim()) {
      validateAndPreview(text)
    } else {
      setPreview(null)
      setError(null)
    }
  }

  const handleImport = () => {
    if (!jsonContent.trim()) {
      setError('Please provide JSON content')
      return
    }

    try {
      const data = JSON.parse(jsonContent)
      onImport(data)
    } catch (err) {
      setError('Invalid JSON format')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (event) => {
        setJsonContent(event.target.result)
        validateAndPreview(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">📥 Import Module</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* File Input */}
          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center mb-4 cursor-pointer hover:border-slate-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-4xl mb-2">📄</div>
            <div className="text-slate-300">
              Click to upload or drag and drop
            </div>
            <div className="text-sm text-slate-500 mt-1">
              JSON files only
            </div>
          </div>

          {/* Or divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-sm">or paste JSON</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Text Input */}
          <textarea
            value={jsonContent}
            onChange={handleTextChange}
            placeholder='{"module": {"name": "..."}, "requests": [...]}'
            className="w-full h-48 bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />

          {/* Error */}
          {error && (
            <div className="mt-3 bg-red-900/30 border border-red-700 rounded-md px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && !error && (
            <div className="mt-4 bg-slate-900/50 border border-slate-700 rounded-md p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Module:</span>
                  <span className="text-slate-200 ml-2">{preview.moduleName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Requests:</span>
                  <span className="text-slate-200 ml-2">{preview.requestCount}</span>
                </div>
              </div>
              {preview.sampleRequest && (
                <div className="mt-2 text-xs text-slate-500">
                  Sample: {preview.sampleRequest.method} {preview.sampleRequest.url}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!preview || !!error}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:text-slate-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}
