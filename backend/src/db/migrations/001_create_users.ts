import type { Knex } from 'knex'
// Knex.js, a SQL query builder for Node.js,

// Creates a table users with column schema
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.string('email', 255).notNullable().unique()
    table.timestamps(true, true)
  })
}

// Rolls back the migration and deletes the users table
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
