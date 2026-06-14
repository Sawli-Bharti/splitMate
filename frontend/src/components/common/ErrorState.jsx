import { Button } from '../ui/button'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-left">
      <h2 className="text-base font-semibold text-red-950">{title}</h2>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <Button className="mt-4" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  )
}
