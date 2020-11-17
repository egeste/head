import express from 'express'

import injectRoutes from './routes'

const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('online')
})

injectRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
