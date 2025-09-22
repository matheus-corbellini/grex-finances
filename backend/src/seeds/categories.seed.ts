import { DataSource } from "typeorm";
import { Category } from "../modules/categories/entities/category.entity";
import { Subcategory } from "../modules/categories/entities/subcategory.entity";

export async function seedCategories(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);
    const subcategoryRepository = dataSource.getRepository(Subcategory);

    // Categorias de receitas
    const incomeCategories = [
        {
            name: "Salário",
            type: "income",
            color: "#10b981",
            icon: "briefcase",
            description: "Salário e remunerações",
            isDefault: true
        },
        {
            name: "Freelance",
            type: "income",
            color: "#3b82f6",
            icon: "laptop",
            description: "Trabalhos freelancer",
            isDefault: true
        },
        {
            name: "Investimentos",
            type: "income",
            color: "#8b5cf6",
            icon: "trending-up",
            description: "Rendimentos de investimentos",
            isDefault: true
        },
        {
            name: "Outros",
            type: "income",
            color: "#6b7280",
            icon: "plus",
            description: "Outras receitas",
            isDefault: true
        }
    ];

    // Categorias de despesas
    const expenseCategories = [
        {
            name: "Alimentação",
            type: "expense",
            color: "#ef4444",
            icon: "utensils",
            description: "Gastos com alimentação",
            isDefault: true
        },
        {
            name: "Transporte",
            type: "expense",
            color: "#f59e0b",
            icon: "car",
            description: "Gastos com transporte",
            isDefault: true
        },
        {
            name: "Moradia",
            type: "expense",
            color: "#8b5cf6",
            icon: "home",
            description: "Gastos com moradia",
            isDefault: true
        },
        {
            name: "Saúde",
            type: "expense",
            color: "#ec4899",
            icon: "heart",
            description: "Gastos com saúde",
            isDefault: true
        },
        {
            name: "Educação",
            type: "expense",
            color: "#06b6d4",
            icon: "book",
            description: "Gastos com educação",
            isDefault: true
        },
        {
            name: "Lazer",
            type: "expense",
            color: "#84cc16",
            icon: "gamepad-2",
            description: "Gastos com lazer",
            isDefault: true
        },
        {
            name: "Outros",
            type: "expense",
            color: "#6b7280",
            icon: "minus",
            description: "Outras despesas",
            isDefault: true
        }
    ];

    // Criar categorias de receitas
    for (const categoryData of incomeCategories) {
        const existingCategory = await categoryRepository.findOne({
            where: { name: categoryData.name, type: categoryData.type }
        });

        if (!existingCategory) {
            const category = categoryRepository.create(categoryData);
            await categoryRepository.save(category);
            console.log(`✅ Categoria de receita criada: ${categoryData.name}`);
        } else {
            console.log(`⚠️  Categoria de receita já existe: ${categoryData.name}`);
        }
    }

    // Criar categorias de despesas
    for (const categoryData of expenseCategories) {
        const existingCategory = await categoryRepository.findOne({
            where: { name: categoryData.name, type: categoryData.type }
        });

        if (!existingCategory) {
            const category = categoryRepository.create(categoryData);
            await categoryRepository.save(category);
            console.log(`✅ Categoria de despesa criada: ${categoryData.name}`);
        } else {
            console.log(`⚠️  Categoria de despesa já existe: ${categoryData.name}`);
        }
    }

    // Criar subcategorias para algumas categorias principais
    const alimentacaoCategory = await categoryRepository.findOne({
        where: { name: "Alimentação", type: "expense" }
    });

    if (alimentacaoCategory) {
        const alimentacaoSubcategories = [
            { name: "Supermercado", color: "#ef4444", icon: "shopping-cart" },
            { name: "Restaurante", color: "#f97316", icon: "utensils" },
            { name: "Delivery", color: "#eab308", icon: "truck" }
        ];

        for (const subcategoryData of alimentacaoSubcategories) {
            const existingSubcategory = await subcategoryRepository.findOne({
                where: { name: subcategoryData.name, categoryId: alimentacaoCategory.id }
            });

            if (!existingSubcategory) {
                const subcategory = subcategoryRepository.create({
                    ...subcategoryData,
                    categoryId: alimentacaoCategory.id,
                    description: `Subcategoria de ${alimentacaoCategory.name}`
                });
                await subcategoryRepository.save(subcategory);
                console.log(`✅ Subcategoria criada: ${subcategoryData.name}`);
            }
        }
    }

    const transporteCategory = await categoryRepository.findOne({
        where: { name: "Transporte", type: "expense" }
    });

    if (transporteCategory) {
        const transporteSubcategories = [
            { name: "Combustível", color: "#f59e0b", icon: "fuel" },
            { name: "Uber/Taxi", color: "#3b82f6", icon: "car" },
            { name: "Ônibus", color: "#10b981", icon: "bus" },
            { name: "Metrô", color: "#8b5cf6", icon: "train" }
        ];

        for (const subcategoryData of transporteSubcategories) {
            const existingSubcategory = await subcategoryRepository.findOne({
                where: { name: subcategoryData.name, categoryId: transporteCategory.id }
            });

            if (!existingSubcategory) {
                const subcategory = subcategoryRepository.create({
                    ...subcategoryData,
                    categoryId: transporteCategory.id,
                    description: `Subcategoria de ${transporteCategory.name}`
                });
                await subcategoryRepository.save(subcategory);
                console.log(`✅ Subcategoria criada: ${subcategoryData.name}`);
            }
        }
    }
}
