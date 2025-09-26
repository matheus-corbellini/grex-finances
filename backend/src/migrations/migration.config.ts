import { DataSource } from "typeorm";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

export default new DataSource({
    type: "sqlite",
    database: "grex_finances.db",
    entities: [],
    migrations: [
        __dirname + "/1700000000000-CreateAccountsTables{.ts,.js}",
        __dirname + "/1700000000001-CreateUsersTables{.ts,.js}",
        __dirname + "/1700000000002-CreateCategoriesTables{.ts,.js}",
        __dirname + "/1700000000003-CreateRecurringTransactionsTable{.ts,.js}",
        __dirname + "/1758898239273-CreateTransactionsTable{.ts,.js}"
    ],
    synchronize: false,
    logging: true,
});
