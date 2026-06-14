import api from '../api/axios'
import { unwrapApiResponse } from '../utils/helpers'

export const balanceService = {
  getMyBalances: async () => {
    const response = await api.get('/api/balances/me')
    return unwrapApiResponse(response) ?? {
      youOwe: 0,
      youAreOwed: 0,
      netBalance: 0,
    }
  },

  getGroupBalances: async (groupId) => {
    const response = await api.get(`/api/balances/group/${groupId}`)
    return unwrapApiResponse(response) ?? []
  },
}
