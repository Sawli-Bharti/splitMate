import api from '../api/axios'
import { unwrapApiResponse } from '../utils/helpers'

export const expenseService = {
  // Get all expenses for a group
  getExpensesByGroup: async (groupId) => {
    const response = await api.get(`/api/expenses/group/${groupId}`)
    return unwrapApiResponse(response) ?? []
  },

  // Get single expense
  getExpense: async (expenseId) => {
    const response = await api.get(`/api/expenses/${expenseId}`)
    return unwrapApiResponse(response)
  },

  // Create expense
  createExpense: async (data) => {
    const response = await api.post('/api/expenses', data)
    return unwrapApiResponse(response)
  },

  // Delete expense
  deleteExpense: async (expenseId) => {
    const response = await api.delete(`/api/expenses/${expenseId}`)
    return unwrapApiResponse(response)
  },
}
