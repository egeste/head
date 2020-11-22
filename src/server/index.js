import express from 'express'
import injectRoutes from './routes'

const app = express()
const port = 8080

injectRoutes(app)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
