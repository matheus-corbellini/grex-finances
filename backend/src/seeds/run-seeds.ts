import { DataSource } from "typeorm";
import { config } from "dotenv";
import { seedAccountTypes } from "./account-types.seed";
import { seedCategories } from "./categories.seed";
import { seedAdminUser } from "./admin-user.seed";

// Carregar variáveis de ambiente
config();

async function runSeeds() {
    console.log("🌱 Iniciando seeds...");

    const dataSource = new DataSource({
        type: "sqlite",
        database: "grex_finances.db",
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: false,
        logging: false,
    });

    try {
        await dataSource.initialize();
        console.log("✅ Conexão com banco de dados estabelecida");

        // Executar seeds
        await seedAccountTypes(dataSource);
        await seedCategories(dataSource);
        await seedAdminUser(dataSource);

        console.log("🎉 Seeds executados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao executar seeds:", error);
        process.exit(1);
    } finally {
        await dataSource.destroy();
        console.log("🔌 Conexão com banco de dados encerrada");
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    runSeeds();
}

export { runSeeds };
