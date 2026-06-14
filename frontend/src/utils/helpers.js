export function unwrapApiResponse(response) {
  return response?.data?.data ?? null
}

export function getApiMessage(response, fallback = 'Request completed') {
  return response?.data?.message ?? fallback
}

export function isSuccessfulApiResponse(response) {
  return Boolean(response?.data?.success)
}

export function normalizeApiError(error) {
  return {
    status: error?.response?.status ?? null,
    message:
      error?.response?.data?.message ??
      error?.message ??
      'Something went wrong. Please try again.',
    data: error?.response?.data?.data ?? null,
  }
}
