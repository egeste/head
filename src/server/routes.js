import { createProxyMiddleware } from 'http-proxy-middleware'
import { socketProxy } from './socket'

export default app => {
  app.use(socketProxy)

  app.use(createProxyMiddleware('/cameras', {
    target: process.env.WEBCAM_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/cameras': '/'
    }
  }))
}
