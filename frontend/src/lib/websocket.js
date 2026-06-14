import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

/**
 * Creates and configures a STOMP client.
 * @param {Object} params
 * @param {string} params.token - The user's JWT token
 * @param {Function} params.onConnect - Callback on successful connection
 * @param {Function} params.onDisconnect - Callback on disconnection
 * @param {Function} params.onError - Callback on STOMP protocol error
 * @param {Function} params.onWebSocketError - Callback on WebSocket network error
 * @returns {Client} The configured STOMP Client instance
 */
export function createStompClient({
  token,
  onConnect,
  onDisconnect,
  onError,
  onWebSocketError,
}) {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const socketUrl = `${baseURL}/ws?token=${encodeURIComponent(token)}`

  const client = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      console.log('[STOMP]', str)
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  })

  client.onConnect = (frame) => {
    console.log('[STOMP] Connected')
    if (onConnect) {
      onConnect(frame)
    }
  }

  client.onDisconnect = (frame) => {
    console.log('[STOMP] Disconnected')
    if (onDisconnect) {
      onDisconnect(frame)
    }
  }

  client.onStompError = (frame) => {
    console.error('[STOMP] Protocol Error:', frame.headers['message'])
    console.error('[STOMP] Details:', frame.body)
    if (onError) {
      onError(frame)
    }
  }

  client.onWebSocketError = (event) => {
    console.error('[STOMP] WebSocket Network Error:', event)
    if (onWebSocketError) {
      onWebSocketError(event)
    }
  }

  return client
}
