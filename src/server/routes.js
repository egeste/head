require('dotenv').config()

import { createProxyMiddleware } from 'http-proxy-middleware'

import { socketProxy } from './socket'

export default app => {
  app.use(socketProxy)

  app.get('/cameras/left_eye', createProxyMiddleware({
    target: process.env.LEFT_EYE_URL,
    changeOrigin: true
  }))

  app.get('/cameras/right_eye', createProxyMiddleware({
    target: process.env.RIGHT_EYE_URL,
    changeOrigin: true
  }))
}
