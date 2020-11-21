import WebSocket from 'ws'

import { createProxyMiddleware } from 'http-proxy-middleware'

import {
  ERROR,
  CONNECTED,
  SERVO_POSITION
} from './events'

import servos from '../servos'

export const socketPort = 8667

export const socketProxy = createProxyMiddleware('/socket', {
  ws: true,
  target: `ws://localhost:${socketPort}/`,
  changeOrigin: true
})

export const socketServer = new WebSocket.Server({
  port: socketPort
})

socketServer.on('upgrade', socketProxy.upgrade)

socketServer.on('connection', socket => {
  const sendMessage = message => {
    return socket.send(JSON.stringify(message))
  }

  const sendPositionMessage = (name, servo) => {
    return sendMessage({ event: SERVO_POSITION, name, position: servo.getPosition() })
  }

  socket.on('message', async input => {
    try {
      const message = JSON.parse(input)

      switch(message.event) {

        case SERVO_POSITION: {
          if (!servos[message.name]) throw 'Servo not found'
          return await servos[message.name].setPosition(message.position)
        }

        default: throw 'Unhandled event'
      }
    } catch (error) {
      sendMessage({ event: ERROR, error, input })
    }
  })

  sendMessage({ event: CONNECTED })

  Object.entries(servos).map(([ name, servo ]) => {
    const sendPosition = () => sendPositionMessage(name, servo)
    servo.on('position', sendPosition)
    socket.on('close', () => servo.off('position', sendPosition))
    sendPosition()
  })
})
