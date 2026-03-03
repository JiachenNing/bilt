import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initializeDatabase } from './db/knex.js'
import users from './routes/users.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Interview Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
    },
  })
})

app.route('/api/users', users)

// Initialize database and start server
const port = 3001

async function startServer() {
  try {
    await initializeDatabase()

    serve({
      fetch: app.fetch,
      port,
    })

    console.log(`🔥 Server is running on http://localhost:${port}`)
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
