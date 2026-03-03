import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Knex.Config = {
  client: "better-sqlite3",
  connection: {
    filename: ":memory:",
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, "db", "migrations"),
    extension: "ts",
  },
  seeds: {
    directory: path.join(__dirname, "db", "seeds"),
    extension: "ts",
  },
};

export default config;
