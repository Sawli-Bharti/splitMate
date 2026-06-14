import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { expenseService } from '../services/expenseService'
import { balanceKeys } from './useBalances'
import { groupKeys } from './useGroups'

export const expenseKeys = {
  all: ['expenses'],
  lists: () => [...expenseKeys.all, 'list'],
  listByGroup: (groupId) => [...expenseKeys.lists(), groupId],
  details: () => [...expenseKeys.all, 'detail'],
  detail: (id) => [...expenseKeys.details(), id],
}

// Queries
export function useExpensesByGroup(groupId) {
  return useQuery({
    queryKey: expenseKeys.listByGroup(groupId),
    queryFn: () => expenseService.getExpensesByGroup(groupId),
    enabled: !!groupId,
  })
}

export function useExpense(expenseId) {
  return useQuery({
    queryKey: expenseKeys.detail(expenseId),
    queryFn: () => expenseService.getExpense(expenseId),
    enabled: !!expenseId,
  })
}

// Mutations
export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => expenseService.createExpense(data),
    onSuccess: (data, variables) => {
      // Invalidate group expenses list
      if (variables.groupId) {
        queryClient.invalidateQueries({ queryKey: expenseKeys.listByGroup(variables.groupId) })
        queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) })
        queryClient.invalidateQueries({ queryKey: balanceKeys.group(variables.groupId) })
      }
      // Invalidate dashboard queries
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: balanceKeys.me() })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expenseId) => expenseService.deleteExpense(expenseId),
    onSuccess: () => {
      // Find which group this expense belongs to and invalidate
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: balanceKeys.all })
    },
  })
}
