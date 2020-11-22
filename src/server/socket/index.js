import WebSocket from 'ws'

import { createProxyMiddleware } from 'http-proxy-middleware'

import {
  ERROR,
  CONNECTED,
  SERVO_POSITION,
  SERVO_PULSE_WIDTH
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
    let message
    try { message = JSON.parse(input) }
    catch (error) { return sendMessage({ event: ERROR, error, input }) }

    switch(message.event) {

      case SERVO_POSITION: {
        if (!servos[message.name]) throw 'servo not found'
        return await servos[message.name].setPosition(message.position)
      }

      case SERVO_PULSE_WIDTH: {
        if (!servos[message.name]) throw 'servo not found'
        return await servos[message.name].setPulseWidth(message.pulse)
      }

      default: sendMessage({ event: ERROR, error: 'unknown event', input })
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
