import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { UserRole } from "./entities/user-role.entity";
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, AssignRoleDto, UserResponseDto } from "./dto/user.dto";
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from "./dto/role.dto";
import { Permission } from "./entities/role.entity";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) { }

  // ===== USER METHODS =====

  async create(createDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Verificar se email já existe
      const existingUser = await this.userRepository.findOne({
        where: { email: createDto.email }
      });

      if (existingUser) {
        throw new ConflictException("Email já está em uso");
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(createDto.password, 10);

      // Criar usuário
      const user = this.userRepository.create({
        ...createDto,
        password: hashedPassword,
        emailVerificationToken: crypto.randomBytes(32).toString('hex')
      });

      const savedUser = await this.userRepository.save(user);

      this.logger.log(`Usuário criado: ${savedUser.id} - ${savedUser.email}`);

      return this.mapUserToResponse(savedUser);
    } catch (error) {
      this.logger.error(`Erro ao criar usuário:`, error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ users: UserResponseDto[], total: number }> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userRoles', 'userRole')
        .leftJoinAndSelect('userRole.role', 'role')
        .orderBy('user.createdAt', 'DESC');

      if (search) {
        queryBuilder.where(
          'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
          { search: `%${search}%` }
        );
      }

      const [users, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const userResponses = await Promise.all(
        users.map(user => this.mapUserToResponse(user))
      );

      return { users: userResponses, total };
    } catch (error) {
      this.logger.error(`Erro ao buscar usuários:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['userRoles', 'userRoles.role']
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      return this.mapUserToResponse(user);
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        relations: ['userRoles', 'userRoles.role']
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por email ${email}:`, error);
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      // Atualizar campos
      Object.assign(user, updateDto);

      const savedUser = await this.userRepository.save(user);

      this.logger.log(`Usuário atualizado: ${savedUser.id}`);

      return this.mapUserToResponse(savedUser);
    } catch (error) {
      this.logger.error(`Erro ao atualizar usuário ${id}:`, error);
      throw error;
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      // Verificar senha atual
      const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new BadRequestException("Senha atual incorreta");
      }

      // Hash da nova senha
      const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

      user.password = hashedNewPassword;
      await this.userRepository.save(user);

      this.logger.log(`Senha alterada para usuário: ${user.id}`);
    } catch (error) {
      this.logger.error(`Erro ao alterar senha do usuário ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      // Soft delete
      user.isActive = false;
      await this.userRepository.save(user);

      this.logger.log(`Usuário removido (soft delete): ${user.id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover usuário ${id}:`, error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { emailVerificationToken: token }
      });

      if (!user) {
        throw new NotFoundException("Token de verificação inválido");
      }

      user.emailVerified = true;
      user.emailVerificationToken = null;
      await this.userRepository.save(user);

      this.logger.log(`Email verificado para usuário: ${user.id}`);
    } catch (error) {
      this.logger.error(`Erro ao verificar email:`, error);
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.userRepository.update(id, {
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar último login do usuário ${id}:`, error);
    }
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) return;

      const attempts = user.loginAttempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // Lock por 30 minutos

      await this.userRepository.update(id, {
        loginAttempts: attempts,
        lockedUntil: lockUntil
      });

      if (lockUntil) {
        this.logger.warn(`Usuário ${id} bloqueado por muitas tentativas de login`);
      }
    } catch (error) {
      this.logger.error(`Erro ao incrementar tentativas de login do usuário ${id}:`, error);
    }
  }

  // ===== ROLE METHODS =====

  async createRole(createDto: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      // Verificar se role já existe
      const existingRole = await this.roleRepository.findOne({
        where: { name: createDto.name }
      });

      if (existingRole) {
        throw new ConflictException("Role já existe");
      }

      const role = this.roleRepository.create(createDto);
      const savedRole = await this.roleRepository.save(role);

      this.logger.log(`Role criado: ${savedRole.id} - ${savedRole.name}`);

      return this.mapRoleToResponse(savedRole);
    } catch (error) {
      this.logger.error(`Erro ao criar role:`, error);
      throw error;
    }
  }

  async findAllRoles(): Promise<RoleResponseDto[]> {
    try {
      const roles = await this.roleRepository.find({
        order: { name: 'ASC' }
      });

      const roleResponses = await Promise.all(
        roles.map(async role => {
          const response = this.mapRoleToResponse(role);
          response.userCount = await this.userRoleRepository.count({
            where: { roleId: role.id, isActive: true }
          });
          return response;
        })
      );

      return roleResponses;
    } catch (error) {
      this.logger.error(`Erro ao buscar roles:`, error);
      throw error;
    }
  }

  async findOneRole(id: string): Promise<RoleResponseDto> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new NotFoundException("Role não encontrado");
      }

      const response = this.mapRoleToResponse(role);
      response.userCount = await this.userRoleRepository.count({
        where: { roleId: role.id, isActive: true }
      });

      return response;
    } catch (error) {
      this.logger.error(`Erro ao buscar role ${id}:`, error);
      throw error;
    }
  }

  async updateRole(id: string, updateDto: UpdateRoleDto): Promise<RoleResponseDto> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new NotFoundException("Role não encontrado");
      }

      if (role.isSystem) {
        throw new BadRequestException("Roles do sistema não podem ser editados");
      }

      Object.assign(role, updateDto);
      const savedRole = await this.roleRepository.save(role);

      this.logger.log(`Role atualizado: ${savedRole.id}`);

      return this.mapRoleToResponse(savedRole);
    } catch (error) {
      this.logger.error(`Erro ao atualizar role ${id}:`, error);
      throw error;
    }
  }

  async removeRole(id: string): Promise<void> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new NotFoundException("Role não encontrado");
      }

      if (role.isSystem) {
        throw new BadRequestException("Roles do sistema não podem ser removidos");
      }

      // Verificar se há usuários com este role
      const userCount = await this.userRoleRepository.count({
        where: { roleId: id, isActive: true }
      });

      if (userCount > 0) {
        throw new BadRequestException("Não é possível remover role que está sendo usado por usuários");
      }

      await this.roleRepository.remove(role);

      this.logger.log(`Role removido: ${role.id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover role ${id}:`, error);
      throw error;
    }
  }

  // ===== USER ROLE METHODS =====

  async assignRole(userId: string, assignRoleDto: AssignRoleDto, assignedBy: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const role = await this.roleRepository.findOne({ where: { id: assignRoleDto.roleId } });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      if (!role) {
        throw new NotFoundException("Role não encontrado");
      }

      // Verificar se já tem este role
      const existingUserRole = await this.userRoleRepository.findOne({
        where: { userId, roleId: assignRoleDto.roleId, isActive: true }
      });

      if (existingUserRole) {
        throw new ConflictException("Usuário já possui este role");
      }

      const userRole = this.userRoleRepository.create({
        userId,
        roleId: assignRoleDto.roleId,
        assignedBy,
        reason: assignRoleDto.reason,
        expiresAt: assignRoleDto.expiresAt
      });

      await this.userRoleRepository.save(userRole);

      this.logger.log(`Role ${role.name} atribuído ao usuário ${userId} por ${assignedBy}`);
    } catch (error) {
      this.logger.error(`Erro ao atribuir role ao usuário ${userId}:`, error);
      throw error;
    }
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    try {
      const userRole = await this.userRoleRepository.findOne({
        where: { userId, roleId, isActive: true }
      });

      if (!userRole) {
        throw new NotFoundException("Role não encontrado para este usuário");
      }

      userRole.isActive = false;
      await this.userRoleRepository.save(userRole);

      this.logger.log(`Role ${roleId} removido do usuário ${userId}`);
    } catch (error) {
      this.logger.error(`Erro ao remover role do usuário ${userId}:`, error);
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<RoleResponseDto[]> {
    try {
      const userRoles = await this.userRoleRepository.find({
        where: { userId, isActive: true },
        relations: ['role'],
        order: { createdAt: 'DESC' }
      });

      return userRoles.map(userRole => this.mapRoleToResponse(userRole.role));
    } catch (error) {
      this.logger.error(`Erro ao buscar roles do usuário ${userId}:`, error);
      throw error;
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const userRoles = await this.userRoleRepository.find({
        where: { userId, isActive: true },
        relations: ['role']
      });

      const permissions = new Set<Permission>();

      userRoles.forEach(userRole => {
        if (!userRole.expiresAt || userRole.expiresAt > new Date()) {
          userRole.role.permissions.forEach(permission => {
            permissions.add(permission);
          });
        }
      });

      return Array.from(permissions);
    } catch (error) {
      this.logger.error(`Erro ao buscar permissões do usuário ${userId}:`, error);
      throw error;
    }
  }

  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      return permissions.includes(permission) || permissions.includes(Permission.ADMIN_ALL);
    } catch (error) {
      this.logger.error(`Erro ao verificar permissão do usuário ${userId}:`, error);
      return false;
    }
  }

  // ===== UTILITY METHODS =====

  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles?.filter(ur => ur.isActive).map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        permissions: ur.role.permissions,
        assignedAt: ur.createdAt,
        expiresAt: ur.expiresAt
      })) || []
    };
  }

  private mapRoleToResponse(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
      isSystem: role.isSystem,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  }
} 