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
        name: "Administrador",
        firebaseUid: "admin-firebase-uid", // Em produção, usar UID real do Firebase
        isActive: true,
        emailVerified: true,
        lastLoginAt: new Date()
    });

    const savedAdminUser = await userRepository.save(adminUser);
    console.log("✅ Usuário administrador criado");

    // Criar perfil do usuário administrador
    const adminProfile = userProfileRepository.create({
        userId: savedAdminUser.id,
        firstName: "Admin",
        lastName: "Grex Finances",
        phone: "+55 11 99999-9999",
        city: "São Paulo",
        state: "SP",
        country: "Brasil"
    });

    await userProfileRepository.save(adminProfile);
    console.log("✅ Perfil do usuário administrador criado");
}
