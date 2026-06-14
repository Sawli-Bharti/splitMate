import { useEffect, useState, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { chatService } from '../services/chatService'
import { createStompClient } from '../lib/websocket'

export const chatKeys = {
  all: ['chat'],
  group: (groupId) => [...chatKeys.all, 'group', groupId],
}

/**
 * Hook to manage real-time group chat.
 * @param {string|number} groupId - The ID of the group
 */
export function useChat(groupId) {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [prevHistory, setPrevHistory] = useState(null)
  const [prevConnectionKey, setPrevConnectionKey] = useState(null)
  const stompClientRef = useRef(null)

  // Fetch initial history via React Query
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: chatKeys.group(groupId),
    queryFn: () => chatService.getGroupMessages(groupId),
    enabled: !!groupId,
    staleTime: 0,
  })

  // Sync initial history with state in render phase
  if (history !== prevHistory) {
    setPrevHistory(history)
    setMessages(history ?? [])
  }

  // Reset connection status in render phase if group/token changes
  const connectionKey = `${groupId}-${token}`
  if (connectionKey !== prevConnectionKey) {
    setPrevConnectionKey(connectionKey)
    setConnectionStatus('connecting')
  }

  // Manage WebSocket lifecycle
  useEffect(() => {
    if (!groupId || !token) return

    const client = createStompClient({
      token,
      onConnect: () => {
        setConnectionStatus('connected')
        // Subscribe to group chat updates
        client.subscribe(`/topic/group/${groupId}`, (message) => {
          try {
            const receivedMsg = JSON.parse(message.body)
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === receivedMsg.id)
              if (exists) {
                // Update message in place (handles edits & deletes)
                return prev.map((m) => (m.id === receivedMsg.id ? receivedMsg : m))
              } else {
                // Append new message
                return [...prev, receivedMsg]
              }
            })
          } catch (err) {
            console.error('[STOMP] Error parsing message body:', err)
          }
        })
      },
      onDisconnect: () => {
        setConnectionStatus('disconnected')
      },
      onError: (err) => {
        console.error('[STOMP] Connection error callback:', err)
        setConnectionStatus('reconnecting')
      },
      onWebSocketError: (err) => {
        console.error('[STOMP] WebSocket network error callback:', err)
        setConnectionStatus('reconnecting')
      },
    })

    stompClientRef.current = client
    client.activate()

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        stompClientRef.current = null
      }
    }
  }, [groupId, token])

  // Sends a message
  const sendMessage = useCallback((messageText) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat/send',
        body: JSON.stringify({
          groupId: Number(groupId),
          message: messageText,
        }),
      })
      return true
    }
    return false
  }, [groupId])

  // Edits a message
  const editMessage = useCallback((messageId, newMessageText) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat/edit',
        body: JSON.stringify({
          messageId: Number(messageId),
          message: newMessageText,
        }),
      })
      return true
    }
    return false
  }, [])

  // Deletes a message (marks deleted in DB and replaces text)
  const deleteMessage = useCallback((messageId) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat/delete',
        body: JSON.stringify({
          messageId: Number(messageId),
        }),
      })
      return true
    }
    return false
  }, [])

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    connectionStatus,
    isLoading: historyLoading,
    error: historyError,
    refetchHistory,
    currentUser: user,
  }
}
