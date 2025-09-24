import { DataSource } from "typeorm";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "grex_finances_dev",
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/*{.ts,.js}"],
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
