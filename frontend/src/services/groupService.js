import api from '../api/axios'
import { unwrapApiResponse } from '../utils/helpers'

export const groupService = {
  // Get all groups
  getGroups: async () => {
    const response = await api.get('/api/groups')
    return unwrapApiResponse(response) ?? []
  },

  // Get single group
  getGroup: async (groupId) => {
    const response = await api.get(`/api/groups/${groupId}`)
    return unwrapApiResponse(response)
  },

  // Create group
  createGroup: async (data) => {
    const response = await api.post('/api/groups', data)
    return unwrapApiResponse(response)
  },

  // Update group
  updateGroup: async (groupId, data) => {
    const response = await api.put(`/api/groups/${groupId}`, data)
    return unwrapApiResponse(response)
  },

  // Delete group
  deleteGroup: async (groupId) => {
    const response = await api.delete(`/api/groups/${groupId}`)
    return unwrapApiResponse(response)
  },

  // Add member to group
  addMember: async (groupId, data) => {
    const response = await api.post(`/api/groups/${groupId}/members`, data)
    return unwrapApiResponse(response)
  },

  // Remove member from group
  removeMember: async (groupId, userId) => {
    const response = await api.delete(`/api/groups/${groupId}/members/${userId}`)
    return unwrapApiResponse(response)
  },
}
