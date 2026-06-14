import { useQuery } from '@tanstack/react-query'
import { balanceService } from '../services/balanceService'

export const balanceKeys = {
  all: ['balances'],
  me: () => [...balanceKeys.all, 'me'],
  groups: () => [...balanceKeys.all, 'group'],
  group: (groupId) => [...balanceKeys.groups(), groupId],
}

export function useMyBalances() {
  return useQuery({
    queryKey: balanceKeys.me(),
    queryFn: balanceService.getMyBalances,
  })
}

export function useGroupBalances(groupId) {
  return useQuery({
    queryKey: balanceKeys.group(groupId),
    queryFn: () => balanceService.getGroupBalances(groupId),
    enabled: !!groupId,
  })
}
