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
  target: process.env.WEBSOCKET_URL,
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

  const sendAllStatusMessages = () => {
    return Object.entries(servos).map(([ name, servo ]) => {
      return sendStatusMessage(name, servo)
    })
  }

  socket.on('message', input => {
    try {
      const message = JSON.parse(input)

      switch(message.event) {

        case SERVO_POSITION: {
          if (!servos[message.name]) throw 'servo not found'
          servos[message.name].setPosition(message.position)
            .then(() => sendStatusMessage(message.name, servos[message.name]))
        }

        case SERVO_PULSE_WIDTH: {
          if (!servos[message.name]) throw 'servo not found'
          servos[message.name].setPulseWidth(message.pulse)
            .then(() => sendStatusMessage(message.name, servos[message.name]))
        }

        default: {
          // sendAllStatusMessages()
          throw 'unknown event'
        }
      }

    } catch (error) {
      sendMessage({ event: ERROR, error, input })
    }
  })

  Object.entries(servos).map(([ name, servo ]) => {
    const sendStatus = () => sendStatusMessage(name, servo)
    servo.on('pulse', sendStatus)
    socket.on('close', () => servo.off('pulse', sendStatus))
  })

  sendMessage({ event: CONNECTED })
  sendAllStatusMessages()
})
