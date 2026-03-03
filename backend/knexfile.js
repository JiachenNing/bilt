const config = {
    client: 'better-sqlite3',
    connection: {
        filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
        directory: './src/db/migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './src/db/seeds',
        extension: 'ts',
    },
};
export default config;
