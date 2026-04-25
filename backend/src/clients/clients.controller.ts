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
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.attendant)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um cliente' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista clientes com filtros simples' })
  findAll(@Query() query: ListClientsQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna os detalhes de um cliente' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um cliente' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Inativa logicamente um cliente' })
  deactivate(@Param('id') id: string) {
    return this.clientsService.deactivate(id);
  }
}
