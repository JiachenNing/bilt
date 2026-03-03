import { Hono } from 'hono'
import db from '../db/knex.js'
import type { User, CreateUserInput } from '../types/index.js'

const users = new Hono()

// GET /api/users - Get all users
users.get('/', async (c) => {
  try {
    const allUsers = await db<User>('users').select('*')
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
    const { name, email } = await c.req.json();
    if (!name || !email) return c.json({ error: 'Missing fields' }, 400);
    const [insertedUser] = await db<User>('users').insert({ name, email }).returning('*');
    return c.json(insertedUser, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500)
  }
});

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

export default users
