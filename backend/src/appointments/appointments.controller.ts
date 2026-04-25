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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.attendant, UserRole.client)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um agendamento com validacao de conflito' })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.appointmentsService.create(createAppointmentDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Lista agendamentos conforme o perfil autenticado' })
  findAll(
    @Query() query: ListAppointmentsQueryDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.appointmentsService.findAll(query, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna os detalhes de um agendamento' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.appointmentsService.findOne(id, currentUser);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancela um agendamento' })
  cancel(
    @Param('id') id: string,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.appointmentsService.cancel(id, currentUser);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reagenda um agendamento' })
  reschedule(
    @Param('id') id: string,
    @Body() rescheduleAppointmentDto: RescheduleAppointmentDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.appointmentsService.reschedule(
      id,
      rescheduleAppointmentDto,
      currentUser,
    );
  }
}
