import api from '../api/axios'
import { unwrapApiResponse } from '../utils/helpers'

export async function getDashboardSummary() {
  const response = await api.get('/api/dashboard/summary')
  return unwrapApiResponse(response)
}

export async function getRecentExpenses() {
  const response = await api.get('/api/dashboard/recent-expenses')
  return unwrapApiResponse(response) ?? []
}

export async function getRecentSettlements() {
  const response = await api.get('/api/dashboard/recent-settlements')
  return unwrapApiResponse(response) ?? []
}
