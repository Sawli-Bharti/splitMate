export function showToast({ title, message, type = 'info' }) {
  window.dispatchEvent(
    new CustomEvent('toast:show', {
      detail: {
        id: crypto.randomUUID(),
        title,
        message,
        type,
      },
    }),
  )
}
