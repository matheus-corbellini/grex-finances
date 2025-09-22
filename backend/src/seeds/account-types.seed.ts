import { DataSource } from "typeorm";
import { AccountType } from "../modules/accounts/entities/account-type.entity";

export async function seedAccountTypes(dataSource: DataSource): Promise<void> {
    const accountTypeRepository = dataSource.getRepository(AccountType);

    const accountTypes = [
        {
            name: "Conta Corrente",
            category: "bank",
            description: "Conta corrente bancária tradicional",
            icon: "building-2",
            color: "#3b82f6"
        },
        {
            name: "Carteira Digital",
            category: "wallet",
            description: "Carteira digital (Pix, PicPay, etc.)",
            icon: "wallet",
            color: "#10b981"
        },
        {
            name: "Cartão de Crédito",
            category: "credit_card",
            description: "Cartão de crédito",
            icon: "credit-card",
            color: "#f59e0b"
        },
        {
            name: "Poupança",
            category: "savings",
            description: "Conta poupança",
            icon: "piggy-bank",
            color: "#8b5cf6"
        }
    ];

    for (const accountTypeData of accountTypes) {
        const existingType = await accountTypeRepository.findOne({
            where: { category: accountTypeData.category }
        });

        if (!existingType) {
            const accountType = accountTypeRepository.create(accountTypeData);
            await accountTypeRepository.save(accountType);
            console.log(`✅ Tipo de conta criado: ${accountTypeData.name}`);
        } else {
            console.log(`⚠️  Tipo de conta já existe: ${accountTypeData.name}`);
        }
    }
}
