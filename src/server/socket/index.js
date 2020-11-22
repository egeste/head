import WebSocket from 'ws'

import { createProxyMiddleware } from 'http-proxy-middleware'

import {
  ERROR,
  CONNECTED,
  SERVO_STATUS,
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

  const sendStatusMessage = (servoName, servo) => {
    return sendMessage({
      name: servoName,
      event: SERVO_STATUS,
      status: {
        pulse: servo.getPulseWidth(),
        position: servo.getPosition()
      }
    })
  }

  socket.on('message', async input => {
    try {
      const message = JSON.parse(input)

      switch(message.event) {

        case SERVO_POSITION: {
          if (!servos[message.name]) throw 'servo not found'
          await servos[message.name].setPosition(message.position)
        }

        case SERVO_PULSE_WIDTH: {
          if (!servos[message.name]) throw 'servo not found'
          await servos[message.name].setPulseWidth(message.pulse)
        }

        default: throw 'unknown event'
      }

    } catch (error) {
      sendMessage({ event: ERROR, error, input })
    }

    sendStatusMessage()
  })

  sendMessage({ event: CONNECTED })

  Object.entries(servos).map(([ name, servo ]) => {
    const sendStatus = () => sendStatusMessage(name, servo)
    servo.on('position', sendStatus)
    socket.on('close', () => servo.off('position', sendStatus))
    sendStatus()
  })
})
