import { useEffect, useState } from 'react'

const styles = {
  error: 'border-red-200 bg-red-50 text-red-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  info: 'border-slate-200 bg-white text-slate-950',
}

export default function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (event) => {
      const toast = event.detail
      setToasts((current) => [...current, toast])
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id))
      }, 4000)
    }

    window.addEventListener('toast:show', handleToast)

    return () => window.removeEventListener('toast:show', handleToast)
  }, [])

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 text-sm shadow-lg ${styles[toast.type]}`}
          role="status"
        >
          {toast.title ? <p className="font-semibold">{toast.title}</p> : null}
          <p className={toast.title ? 'mt-1' : ''}>{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
