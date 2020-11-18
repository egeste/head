import WebSocket from 'ws'

import { createProxyMiddleware } from 'http-proxy-middleware'

import {
  CONNECTED_EVENT
} from './events'

import {
  jawYServo,
  eyesXServo,
  eyesYServo,
  neckXServo
} from '../gpio'

export const socketPort = 8667

export const socketProxy = createProxyMiddleware('/socket', {
  ws: true,
  target: `ws://localhost:${socketPort}/`,
  changeOrigin: true
})

export const socketServer = new WebSocket.Server({ port: socketPort })

socketServer.on('upgrade', socketProxy.upgrade)

socketServer.on('connection', socket => {
  socket.send(JSON.stringify({ event: CONNECTED_EVENT }))

  socket.on('message', message => {
    console.log(message)
  })
})

