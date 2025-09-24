import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class CreateCategoriesTables1700000000002 implements MigrationInterface {
    name = 'CreateCategoriesTables1700000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela categories
        await queryRunner.createTable(
            new Table({
                name: "categories",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid()"
                    },
                    {
                        name: "userId",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        comment: "income, expense, transfer"
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "7",
                        isNullable: true
                    },
                    {
                        name: "icon",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "isDefault",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Criar tabela subcategories
        await queryRunner.createTable(
            new Table({
                name: "subcategories",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid()"
                    },
                    {
                        name: "categoryId",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "7",
                        isNullable: true
                    },
                    {
                        name: "icon",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Criar foreign keys
        await queryRunner.createForeignKey(
            "categories",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "subcategories",
            new TableForeignKey({
                columnNames: ["categoryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "categories",
                onDelete: "CASCADE"
            })
        );

        // Criar índices
        await queryRunner.createIndex(
            "categories",
            new TableIndex({
                name: "IDX_categories_userId",
                columnNames: ["userId"]
            })
        );

        await queryRunner.createIndex(
            "categories",
            new TableIndex({
                name: "IDX_categories_type",
                columnNames: ["type"]
            })
        );

        await queryRunner.createIndex(
            "categories",
            new TableIndex({
                name: "IDX_categories_isActive",
                columnNames: ["isActive"]
            })
        );

        await queryRunner.createIndex(
            "subcategories",
            new TableIndex({
                name: "IDX_subcategories_categoryId",
                columnNames: ["categoryId"]
            })
        );

        await queryRunner.createIndex(
            "subcategories",
            new TableIndex({
                name: "IDX_subcategories_isActive",
                columnNames: ["isActive"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover foreign keys
        const categoriesTable = await queryRunner.getTable("categories");
        const subcategoriesTable = await queryRunner.getTable("subcategories");

        if (categoriesTable) {
            const foreignKey = categoriesTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("categories", foreignKey);
            }
        }

        if (subcategoriesTable) {
            const foreignKey = subcategoriesTable.foreignKeys.find(fk => fk.columnNames.indexOf("categoryId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("subcategories", foreignKey);
            }
        }

        // Remover tabelas
        await queryRunner.dropTable("subcategories");
        await queryRunner.dropTable("categories");
    }
}
