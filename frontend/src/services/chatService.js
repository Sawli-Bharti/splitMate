import api from '../api/axios'
import { unwrapApiResponse } from '../utils/helpers'

export const chatService = {
  /**
   * Fetches the initial chat history for a group.
   * @param {string|number} groupId - The ID of the group
   * @returns {Promise<Array>} List of chat messages
   */
  getGroupMessages: async (groupId) => {
    const response = await api.get(`/api/chat/group/${groupId}`)
    return unwrapApiResponse(response) ?? []
  },
}
