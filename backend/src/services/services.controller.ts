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
import { CreateServiceDto } from './dto/create-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Cria um servico' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.attendant, UserRole.client)
  @ApiOperation({ summary: 'Lista servicos com filtros simples' })
  findAll(
    @Query() query: ListServicesQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.servicesService.findAll(query, currentUser);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.attendant)
  @ApiOperation({ summary: 'Retorna os detalhes de um servico' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Atualiza os dados de um servico' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Desativa um servico' })
  deactivate(@Param('id') id: string) {
    return this.servicesService.deactivate(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Reativa um servico' })
  activate(@Param('id') id: string) {
    return this.servicesService.activate(id);
  }
}
