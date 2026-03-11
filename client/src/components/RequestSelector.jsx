import { useState } from 'react'

export default function RequestSelector({ requests, selectedIds, onSelectionChange }) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([])
    } else {
      onSelectionChange(requests.map(r => r.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
    setSelectAll(selectedIds.length === requests.length - 1)
  }

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-800 border-b border-slate-700">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-slate-300">
          {selectAll ? 'Unselect All' : 'Select All'}
        </span>
      </label>
      <span className="text-sm text-slate-400">
        Selected: {selectedIds.length} / {requests.length}
      </span>
    </div>
  )
}

export function RequestCheckbox({ id, checked, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(id)}
      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
    />
  )
}
