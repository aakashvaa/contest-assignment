import express from 'express'
import cors from 'cors'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import contestRoutes from './routes/contests'
import { MONGODB_URL, PORT } from './constants'
import Redis from 'ioredis'
import initializeScheduler from './services'

const app = express()
// running redis container
export const redis = new Redis({
  host: 'localhost',
  port: 6380,
})
// Middleware
app.use(cors())
app.use(express.json())

app.use('/api/contests', contestRoutes)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello from server' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err?.stack)
  res.status(500).send(err)
})

// mongo db connection and server start

redis.on('connect', () => {
  console.log('\n✅ Redis connection established')
})

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err, '\n')
})

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('✅ MongoDB connection established')
    app
      .listen(PORT, () => {
        console.log(`✅ Server running, visit :  http://localhost:${PORT} \n`)

        // get the lastest data from different platform at every 6hr
        initializeScheduler()
      })
      .on('error', (err) => {
        console.error('Error starting server:', err)
      })
  })
  .catch((err) => console.error('MongoDB connection error:', err))
