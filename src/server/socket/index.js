import WebSocket from 'ws'

import { createProxyMiddleware } from 'http-proxy-middleware'

import {
  CONNECTED_EVENT
} from './events'

import { servos } from '../gpio'

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

  Object.entries(servos).map(([ servoName, servo ]) => {
    const sendPosition = () => {
      return socket.send({
        name: servoName,
        event: SERVO_POSITION,
        position: servo.getPosition()
      })
    }

    servo.on('read', sendPosition)
    servo.on('write', sendPosition)

    socket.on('close', () => {
      servo.removeAllListeners()
    })
  })

  socket.on('message', message => {
    console.log(message)
  })
})

