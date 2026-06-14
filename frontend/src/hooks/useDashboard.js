import { useQuery } from '@tanstack/react-query'
import {
  getDashboardSummary,
  getRecentExpenses,
  getRecentSettlements,
} from '../services/dashboardService'

export const dashboardKeys = {
  summary: ['dashboard', 'summary'],
  recentExpenses: ['dashboard', 'recent-expenses'],
  recentSettlements: ['dashboard', 'recent-settlements'],
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: getDashboardSummary,
  })
}

export function useRecentExpenses() {
  return useQuery({
    queryKey: dashboardKeys.recentExpenses,
    queryFn: getRecentExpenses,
  })
}

export function useRecentSettlements() {
  return useQuery({
    queryKey: dashboardKeys.recentSettlements,
    queryFn: getRecentSettlements,
  })
}
