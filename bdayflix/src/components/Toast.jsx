import { useEffect } from 'react'

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const bgColor = {
    success: 'from-green-600 to-emerald-700',
    error: 'from-red-600 to-red-800',
    info: 'from-blue-600 to-indigo-700',
  }[toast.type] || 'from-green-600 to-emerald-700'

  return (
    <div
      className={`pointer-events-auto bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[420px] toast-enter border border-white/10`}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      <span className="text-lg">
        {toast.type === 'success' && '✅'}
        {toast.type === 'error' && '❌'}
        {toast.type === 'info' && 'ℹ️'}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/60 hover:text-white transition-colors text-lg cursor-pointer"
      >
        ✕
      </button>
    </div>
  )
}
