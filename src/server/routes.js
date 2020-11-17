import { createProxyMiddleware } from 'http-proxy-middleware'

export default app => {
  app.get('/left_eye', createProxyMiddleware({
    target: 'http://localhost:8081',
    changeOrigin: true
  }))
  app.get('/right_eye', createProxyMiddleware({
    target: 'http://localhost:8082',
    changeOrigin: true
  }))
}
