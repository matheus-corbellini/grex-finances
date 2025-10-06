import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { Permission } from "./entities/role.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  AssignRoleDto,
  UserResponseDto
} from "./dto/user.dto";
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto
} from "./dto/role.dto";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ===== USER ENDPOINTS =====

  @Post()
  @UseGuards(PermissionGuard(Permission.USER_CREATE))
  @ApiOperation({ summary: "Criar novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso", type: UserResponseDto })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Email já está em uso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.USER_READ))
  @ApiOperation({ summary: "Listar usuários" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Página (padrão: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Limite por página (padrão: 10)" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Buscar por nome ou email" })
  @ApiResponse({ status: 200, description: "Lista de usuários" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string
  ): Promise<{ users: UserResponseDto[], total: number }> {
    return this.usersService.findAll(page || 1, limit || 10, search);
  }

  @Get(":id")
  @UseGuards(PermissionGuard(Permission.USER_READ))
  @ApiOperation({ summary: "Obter usuário por ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado", type: UserResponseDto })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @UseGuards(PermissionGuard(Permission.USER_UPDATE))
  @ApiOperation({ summary: "Atualizar usuário" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso", type: UserResponseDto })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(":id/password")
  @UseGuards(PermissionGuard(Permission.USER_UPDATE))
  @ApiOperation({ summary: "Alterar senha do usuário" })
  @ApiResponse({ status: 200, description: "Senha alterada com sucesso" })
  @ApiResponse({ status: 400, description: "Senha atual incorreta" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async changePassword(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete(":id")
  @UseGuards(PermissionGuard(Permission.USER_DELETE))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover usuário (soft delete)" })
  @ApiResponse({ status: 204, description: "Usuário removido com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post(":id/verify-email")
  @ApiOperation({ summary: "Verificar email do usuário" })
  @ApiResponse({ status: 200, description: "Email verificado com sucesso" })
  @ApiResponse({ status: 404, description: "Token inválido" })
  async verifyEmail(@Param("id", ParseUUIDPipe) id: string, @Body("token") token: string): Promise<void> {
    return this.usersService.verifyEmail(token);
  }

  // ===== ROLE ENDPOINTS =====

  @Post("roles")
  @UseGuards(PermissionGuard(Permission.USER_MANAGE_ROLES))
  @ApiOperation({ summary: "Criar novo role" })
  @ApiResponse({ status: 201, description: "Role criado com sucesso", type: RoleResponseDto })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Role já existe" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.usersService.createRole(createRoleDto);
  }

  @Get("roles")
  @UseGuards(PermissionGuard(Permission.USER_READ))
  @ApiOperation({ summary: "Listar todos os roles" })
  @ApiResponse({ status: 200, description: "Lista de roles", type: [RoleResponseDto] })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async findAllRoles(): Promise<RoleResponseDto[]> {
    return this.usersService.findAllRoles();
  }

  @Get("roles/:id")
  @UseGuards(PermissionGuard(Permission.USER_READ))
  @ApiOperation({ summary: "Obter role por ID" })
  @ApiResponse({ status: 200, description: "Role encontrado", type: RoleResponseDto })
  @ApiResponse({ status: 404, description: "Role não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async findOneRole(@Param("id", ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
    return this.usersService.findOneRole(id);
  }

  @Put("roles/:id")
  @UseGuards(PermissionGuard(Permission.USER_MANAGE_ROLES))
  @ApiOperation({ summary: "Atualizar role" })
  @ApiResponse({ status: 200, description: "Role atualizado com sucesso", type: RoleResponseDto })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Role não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async updateRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    return this.usersService.updateRole(id, updateRoleDto);
  }

  @Delete("roles/:id")
  @UseGuards(PermissionGuard(Permission.USER_MANAGE_ROLES))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover role" })
  @ApiResponse({ status: 204, description: "Role removido com sucesso" })
  @ApiResponse({ status: 400, description: "Role do sistema ou em uso" })
  @ApiResponse({ status: 404, description: "Role não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async removeRole(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.removeRole(id);
  }

  // ===== USER ROLE ENDPOINTS =====

  @Post(":id/roles")
  @UseGuards(PermissionGuard(Permission.USER_MANAGE_ROLES))
  @ApiOperation({ summary: "Atribuir role ao usuário" })
  @ApiResponse({ status: 201, description: "Role atribuído com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Usuário ou role não encontrado" })
  @ApiResponse({ status: 409, description: "Usuário já possui este role" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async assignRole(
    @Param("id", ParseUUIDPipe) userId: string,
    @Body() assignRoleDto: AssignRoleDto,
    @Request() req: any
  ): Promise<void> {
    return this.usersService.assignRole(userId, assignRoleDto, req.user.id);
  }

  @Delete(":id/roles/:roleId")
  @UseGuards(PermissionGuard(Permission.USER_MANAGE_ROLES))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover role do usuário" })
  @ApiResponse({ status: 204, description: "Role removido com sucesso" })
  @ApiResponse({ status: 404, description: "Role não encontrado para este usuário" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async removeRoleFromUser(
    @Param("id", ParseUUIDPipe) userId: string,
    @Param("roleId", ParseUUIDPipe) roleId: string
  ): Promise<void> {
    return this.usersService.removeRoleFromUser(userId, roleId);
  }

  @Get(":id/roles")
  @UseGuards(PermissionGuard(Permission.USER_READ))
  @ApiOperation({ summary: "Obter roles do usuário" })
  @ApiResponse({ status: 200, description: "Roles do usuário", type: [RoleResponseDto] })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async getUserRoles(@Param("id", ParseUUIDPipe) userId: string): Promise<RoleResponseDto[]> {
    return this.usersService.getUserRoles(userId);
  }

  @Get(":id/permissions")
  @UseGuards(PermissionGuard(Permission.USER_READ))
  @ApiOperation({ summary: "Obter permissões do usuário" })
  @ApiResponse({ status: 200, description: "Permissões do usuário" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async getUserPermissions(@Param("id", ParseUUIDPipe) userId: string): Promise<Permission[]> {
    return this.usersService.getUserPermissions(userId);
  }
} 