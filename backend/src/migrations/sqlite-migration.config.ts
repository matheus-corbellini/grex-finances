import { DataSource } from "typeorm";

export default new DataSource({
    type: "sqlite",
    database: "grex_finances.db",
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/*{.ts,.js}"],
    synchronize: false,
    logging: true,
});
