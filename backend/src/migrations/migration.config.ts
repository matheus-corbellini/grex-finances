import { DataSource } from "typeorm";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "grex",
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    entities: [],
    migrations: [
        __dirname + "/1700000000000-CreateAccountsTables{.ts,.js}",
        __dirname + "/1700000000001-CreateUsersTables{.ts,.js}",
        __dirname + "/1700000000002-CreateCategoriesTables{.ts,.js}",
        __dirname + "/1700000000003-CreateRecurringTransactionsTable{.ts,.js}",
        __dirname + "/1758898239273-CreateTransactionsTable{.ts,.js}",
        __dirname + "/1700000000004-CreateOrganizationsTables{.ts,.js}",
        __dirname + "/1700000000005-CreateUsersRolesAndBillingTables{.ts,.js}",
        __dirname + "/1700000000006-CreateCreditCardsTable{.ts,.js}",
        __dirname + "/1700000000007-AddCreditCardAndContactToTransactions{.ts,.js}"
    ],
    synchronize: false,
    logging: true,
});
