import {
  ConflictException,
  ForbiddenException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Prisma, UserRole } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    currentUser: AuthenticatedUser,
  ) {
    const client =
      currentUser.role === UserRole.client
        ? await this.findClientByUserId(currentUser.id)
        : await this.ensureClientIsSchedulable(createAppointmentDto.clientId);
    const service = await this.ensureServiceIsSchedulable(
      createAppointmentDto.serviceId,
    );

    if (
      currentUser.role === UserRole.client &&
      client.userId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Clientes so podem criar agendamentos para o proprio cadastro.',
      );
    }

    const scheduledAt = new Date(createAppointmentDto.scheduledAt);
    const endAt = this.calculateEndAt(scheduledAt, service.durationMinutes);

    await this.ensureNoConflict({
      clientId: client.id,
      scheduledAt,
      endAt,
    });

    return this.prisma.appointment.create({
      data: {
        clientId: client.id,
        serviceId: service.id,
        createdByUserId: currentUser.id,
        scheduledAt,
        endAt,
        notes: createAppointmentDto.notes,
      },
      include: this.defaultInclude(),
    });
  }

  async findAll(
    query: ListAppointmentsQueryDto,
    currentUser: AuthenticatedUser,
  ) {
    const where: Prisma.AppointmentWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.dateFrom || query.dateTo) {
      where.scheduledAt = {};

      if (query.dateFrom) {
        where.scheduledAt.gte = new Date(query.dateFrom);
      }

      if (query.dateTo) {
        where.scheduledAt.lte = new Date(query.dateTo);
      }
    }

    if (currentUser.role === UserRole.client) {
      const client = await this.findClientByUserId(currentUser.id);
      where.clientId = client.id;
    } else if (query.clientId) {
      where.clientId = query.clientId;
    }

    return this.prisma.appointment.findMany({
      where,
      include: this.defaultInclude(),
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento nao encontrado.');
    }

    await this.ensureCanAccessAppointment(appointment.clientId, currentUser);

    return appointment;
  }

  async cancel(id: string, currentUser: AuthenticatedUser) {
    const appointment = await this.findOne(id, currentUser);
    this.ensureAppointmentCanBeManaged(appointment.status);

    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.cancelled },
      include: this.defaultInclude(),
    });
  }

  async reschedule(
    id: string,
    rescheduleAppointmentDto: RescheduleAppointmentDto,
    currentUser: AuthenticatedUser,
  ) {
    const appointment = await this.findOne(id, currentUser);
    this.ensureAppointmentCanBeManaged(appointment.status);

    const service = await this.ensureServiceIsSchedulable(
      appointment.serviceId,
    );
    const scheduledAt = new Date(rescheduleAppointmentDto.scheduledAt);
    const endAt = this.calculateEndAt(scheduledAt, service.durationMinutes);

    await this.ensureNoConflict({
      clientId: appointment.clientId,
      scheduledAt,
      endAt,
      ignoreAppointmentId: appointment.id,
    });

    return this.prisma.appointment.update({
      where: { id },
      data: {
        scheduledAt,
        endAt,
        notes: rescheduleAppointmentDto.notes ?? appointment.notes,
        status: AppointmentStatus.scheduled,
      },
      include: this.defaultInclude(),
    });
  }

  private calculateEndAt(scheduledAt: Date, durationMinutes: number) {
    return new Date(scheduledAt.getTime() + durationMinutes * 60 * 1000);
  }

  private async ensureClientIsSchedulable(clientId?: string) {
    if (!clientId) {
      throw new BadRequestException(
        'clientId e obrigatorio para este perfil ao criar agendamentos.',
      );
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente nao encontrado.');
    }

    if (!client.active) {
      throw new ConflictException(
        'Nao e possivel agendar para um cliente inativo.',
      );
    }

    return client;
  }

  private async ensureServiceIsSchedulable(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Servico nao encontrado.');
    }

    if (!service.active) {
      throw new ConflictException('Nao e possivel agendar um servico inativo.');
    }

    return service;
  }

  private async ensureNoConflict(params: {
    clientId: string;
    scheduledAt: Date;
    endAt: Date;
    ignoreAppointmentId?: string;
  }) {
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        clientId: params.clientId,
        status: {
          not: AppointmentStatus.cancelled,
        },
        id: params.ignoreAppointmentId
          ? {
              not: params.ignoreAppointmentId,
            }
          : undefined,
        scheduledAt: {
          lt: params.endAt,
        },
        endAt: {
          gt: params.scheduledAt,
        },
      },
    });

    if (conflictingAppointment) {
      throw new ConflictException(
        'Ja existe um agendamento conflitante para este horario.',
      );
    }
  }

  private async findClientByUserId(userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new ForbiddenException(
        'O usuario cliente precisa estar vinculado a um cadastro de cliente.',
      );
    }

    return client;
  }

  private async ensureCanAccessAppointment(
    clientId: string,
    currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role !== UserRole.client) {
      return;
    }

    const client = await this.findClientByUserId(currentUser.id);

    if (client.id !== clientId) {
      throw new ForbiddenException(
        'Clientes so podem acessar os proprios agendamentos.',
      );
    }
  }

  private ensureAppointmentCanBeManaged(status: AppointmentStatus) {
    if (status === AppointmentStatus.cancelled) {
      throw new ConflictException('Este agendamento ja esta cancelado.');
    }

    if (
      status === AppointmentStatus.completed ||
      status === AppointmentStatus.no_show
    ) {
      throw new ConflictException(
        'Este agendamento nao pode ser alterado no estado atual.',
      );
    }
  }

  private defaultInclude() {
    return {
      client: true,
      service: true,
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    } satisfies Prisma.AppointmentInclude;
  }
}
