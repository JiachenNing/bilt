import knex from "knex";
import config from "../knexfile.js";

// Create a single in-memory database instance
const db = knex(config);

// Initialize database with migrations and seeds
export async function initializeDatabase() {
  try {
    console.log("Running migrations...");
    await db.migrate.latest();

    console.log("Running seeds...");
    await db.seed.run();

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

export default db;
