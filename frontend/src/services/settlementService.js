import api from '../api/axios'
import { unwrapApiResponse } from '../utils/helpers'

export const settlementService = {
  createSettlement: async (data) => {
    const response = await api.post('/api/settlements', data)
    return unwrapApiResponse(response)
  },

  getGroupSettlements: async (groupId) => {
    const response = await api.get(`/api/settlements/group/${groupId}`)
    return unwrapApiResponse(response) ?? []
  },

  getMySettlements: async () => {
    const response = await api.get('/api/settlements/me')
    return unwrapApiResponse(response) ?? []
  },

  getSettlement: async (settlementId) => {
    const response = await api.get(`/api/settlements/${settlementId}`)
    return unwrapApiResponse(response)
  },
}
