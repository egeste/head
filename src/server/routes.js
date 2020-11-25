import { createProxyMiddleware } from 'http-proxy-middleware'
import { socketProxy } from './socket'

export default app => {
  app.use(socketProxy)

  app.use(createProxyMiddleware('/cameras', {
    target: process.env.LEFT_EYE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/cameras': '/'
    }
  }))
}
