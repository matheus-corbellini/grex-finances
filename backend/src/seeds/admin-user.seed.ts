import { DataSource } from "typeorm";
import { User } from "../modules/users/entities/user.entity";
import { UserProfile } from "../modules/users/entities/user-profile.entity";

export async function seedAdminUser(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const userProfileRepository = dataSource.getRepository(UserProfile);

    // Verificar se já existe um usuário admin
    const existingAdmin = await userRepository.findOne({
        where: { email: "admin@grexfinances.com" }
    });

    if (existingAdmin) {
        console.log("⚠️  Usuário administrador já existe");
        return;
    }

    // Criar usuário administrador
    const adminUser = userRepository.create({
        email: "admin@grexfinances.com",
        firstName: "Admin",
        lastName: "Grex Finances",
        password: "admin123", // Em produção, usar hash da senha
        isActive: true,
        emailVerified: true
    });

    const savedAdminUser = await userRepository.save(adminUser);
    console.log("✅ Usuário administrador criado");

    // Criar perfil do usuário administrador
    const adminProfile = userProfileRepository.create({
        userId: savedAdminUser.id,
        phone: "+55 11 99999-9999",
        address: {
            city: "São Paulo",
            state: "SP",
            country: "Brasil"
        },
        preferences: {
            language: "pt-BR",
            currency: "BRL",
            dateFormat: "DD/MM/YYYY"
        }
    });

    await userProfileRepository.save(adminProfile);
    console.log("✅ Perfil do usuário administrador criado");
}
