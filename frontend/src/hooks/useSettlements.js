import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from './useBalances'
import { dashboardKeys } from './useDashboard'
import { settlementService } from '../services/settlementService'

export const settlementKeys = {
  all: ['settlements'],
  lists: () => [...settlementKeys.all, 'list'],
  me: () => [...settlementKeys.lists(), 'me'],
  group: (groupId) => [...settlementKeys.lists(), 'group', groupId],
  details: () => [...settlementKeys.all, 'detail'],
  detail: (settlementId) => [...settlementKeys.details(), settlementId],
}

export function useMySettlements() {
  return useQuery({
    queryKey: settlementKeys.me(),
    queryFn: settlementService.getMySettlements,
  })
}

export function useGroupSettlements(groupId) {
  return useQuery({
    queryKey: settlementKeys.group(groupId),
    queryFn: () => settlementService.getGroupSettlements(groupId),
    enabled: !!groupId,
  })
}

export function useSettlement(settlementId) {
  return useQuery({
    queryKey: settlementKeys.detail(settlementId),
    queryFn: () => settlementService.getSettlement(settlementId),
    enabled: !!settlementId,
  })
}

export function useCreateSettlement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settlementService.createSettlement,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.recentSettlements })
      queryClient.invalidateQueries({ queryKey: balanceKeys.me() })
      queryClient.invalidateQueries({ queryKey: balanceKeys.groups() })

      if (variables.groupId) {
        queryClient.invalidateQueries({ queryKey: settlementKeys.group(variables.groupId) })
        queryClient.invalidateQueries({ queryKey: balanceKeys.group(variables.groupId) })
      }
    },
  })
}
