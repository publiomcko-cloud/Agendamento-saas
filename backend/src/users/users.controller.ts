import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna os dados do usuario autenticado' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.sanitizeUser(user);
  }

  @Get()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Lista usuarios para a area administrativa' })
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Cria um usuario administrativo' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Atualiza os dados de um usuario' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/activate')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Ativa um usuario' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Inativa um usuario' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Get('admin-only')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Endpoint protegido para administradores' })
  getAdminOnly() {
    return { message: 'Acesso autorizado para admin.' };
  }
}
