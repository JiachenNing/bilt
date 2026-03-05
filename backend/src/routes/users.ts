import { Hono } from 'hono'
import db from '../db/knex.js'
import type { User, CreateUserInput, UpdateUserInput } from '../types/index.js'

// this is Node.js code: uses Hono, a lightweight Node.js HTTP framework
const users = new Hono()

// GET /api/users - Get all users
users.get('/', async (c) => {
  try {
    // always return the list in a deterministic order; sort by name
    const allUsers = await db<User>('users').select('*').orderBy('name', 'asc')
    return c.json(allUsers)
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// GET /api/users/:id - Get user by ID
users.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const user = await db<User>('users').where({ id }).first()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user)
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
})

// POST /api/users - Create new user
users.post('/', async (c) => {
  try {
    const body = await c.req.json<CreateUserInput>()

    const [id] = await db<User>('users').insert({
      name: body.name,
      email: body.email,
    })

    const newUser = await db<User>('users').where({ id }).first()
    return c.json(newUser, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// DELETE /api/users/:id - Delete user
users.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const deleted = await db<User>('users').where({ id }).delete()

    if (deleted === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ message: 'User deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500)
  }
})

// PUT /api/users/:id - Update user
users.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json<UpdateUserInput>()

    const existingUser = await db<User>('users').where({ id }).first()
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 400)
    }

    await db<User>('users').where({ id }).update({
      name: body.name || existingUser.name,
      email: body.email || existingUser.email,
    })

    const updatedUser = await db<User>('users').where({ id }).first()
    return c.json(updatedUser)
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

export default users
