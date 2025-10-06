const { DataSource } = require('typeorm');
const path = require('path');

const dataSource = new DataSource({
    type: "sqlite",
    database: "grex_finances.db",
    entities: [path.join(__dirname, "dist/**/*.entity.js")],
    migrations: [path.join(__dirname, "dist/migrations/*.js")],
    synchronize: false,
    logging: true,
});

async function runMigrations() {
    try {
        await dataSource.initialize();
        console.log('Data Source has been initialized!');

        const migrations = await dataSource.runMigrations();
        console.log('Migrations executed:', migrations);

        await dataSource.destroy();
        console.log('Data Source has been destroyed!');
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
}

runMigrations();
