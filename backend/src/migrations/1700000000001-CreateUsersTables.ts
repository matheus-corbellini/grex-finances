import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class CreateUsersTables1700000000001 implements MigrationInterface {
    name = 'CreateUsersTables1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela users
        await queryRunner.createTable(
            new Table({
                name: "users",
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
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "firebaseUid",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: true
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "emailVerified",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "lastLoginAt",
                        type: "timestamp",
                        isNullable: true
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

        // Criar tabela user_profiles
        await queryRunner.createTable(
            new Table({
                name: "user_profiles",
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
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "firstName",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "lastName",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name: "avatar",
                        type: "varchar",
                        length: "500",
                        isNullable: true
                    },
                    {
                        name: "dateOfBirth",
                        type: "date",
                        isNullable: true
                    },
                    {
                        name: "address",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "state",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "postalCode",
                        type: "varchar",
                        length: "20",
                        isNullable: true
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

        // Criar foreign key para user_profiles
        await queryRunner.createForeignKey(
            "user_profiles",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        // Criar índices
        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_users_email",
                columnNames: ["email"]
            })
        );

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_users_firebaseUid",
                columnNames: ["firebaseUid"]
            })
        );

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_users_isActive",
                columnNames: ["isActive"]
            })
        );

        await queryRunner.createIndex(
            "user_profiles",
            new TableIndex({
                name: "IDX_user_profiles_userId",
                columnNames: ["userId"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover foreign key
        const userProfilesTable = await queryRunner.getTable("user_profiles");
        if (userProfilesTable) {
            const foreignKey = userProfilesTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("user_profiles", foreignKey);
            }
        }

        // Remover tabelas
        await queryRunner.dropTable("user_profiles");
        await queryRunner.dropTable("users");
    }
}
