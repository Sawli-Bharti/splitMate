import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { groupService } from '../services/groupService'

export const groupKeys = {
  all: ['groups'],
  lists: () => [...groupKeys.all, 'list'],
  details: () => [...groupKeys.all, 'detail'],
  detail: (id) => [...groupKeys.details(), id],
}

// Queries
export function useGroups() {
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: () => groupService.getGroups(),
  })
}

export function useGroup(groupId) {
  return useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => groupService.getGroup(groupId),
    enabled: !!groupId,
  })
}

// Mutations
export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => groupService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, data }) => groupService.updateGroup(groupId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) })
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId) => groupService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
  })
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, data }) => groupService.addMember(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, userId }) => groupService.removeMember(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) })
    },
  })
}
