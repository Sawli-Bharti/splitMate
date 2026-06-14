import { cn } from '../../utils/cn'

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 transition-opacity"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-slate-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children, className }) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('space-y-2', className)} {...props} />
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn('text-lg font-semibold text-slate-950', className)} {...props} />
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn('text-sm text-slate-600', className)} {...props} />
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn('flex justify-end gap-3', className)} {...props} />
}
