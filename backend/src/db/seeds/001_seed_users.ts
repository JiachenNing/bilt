import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()

  await knex('users').insert([
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
  ])
}
